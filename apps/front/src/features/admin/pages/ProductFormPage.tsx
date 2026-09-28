import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { productsApi } from "../../catalog/api/productsApi.js";
import type { CreateProductPayload } from "../../catalog/api/productsApi.js";
import type { Product } from "../../catalog/types/product.types.js";
import { useCategories } from "../../catalog/hooks/useCategories.js";
import { useStore } from "../../stores/context/StoreContext.js";

const COLLECTIONS = [
  { value: "textile-performance", label: "Textile Performance" },
  { value: "haute-sellerie", label: "Haute Sellerie" },
];

const DISCIPLINES = [
  { value: "dressage", label: "Dressage" },
  { value: "obstacle", label: "Saut d'obstacles" },
  { value: "complet", label: "Complet" },
  { value: "loisir", label: "Loisir" },
];

const DEFAULT_SHIPPING_INFO =
  "Click & collect disponible 1h après validation de la commande.";

interface ImageField {
  key: string;
  url: string;
}

interface VariantField {
  key: string;
  size: string;
  color: string;
  stockByStore: Record<string, string>;
}

let nextKey = 0;
const newKey = () => `field-${nextKey++}`;
const emptyImage = (): ImageField => ({ key: newKey(), url: "" });
const emptyVariant = (): VariantField => ({
  key: newKey(),
  size: "",
  color: "",
  stockByStore: {},
});

const parseStock = (value: string | undefined): number =>
  Number(value === undefined || value === "" ? "0" : value);

export const ProductFormPage = () => {
  const navigate = useNavigate();
  const { stores, isLoading: areStoresLoading } = useStore();
  const { categories, isLoading: areCategoriesLoading } = useCategories();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [collection, setCollection] = useState(COLLECTIONS[0].value);
  const [discipline, setDiscipline] = useState(DISCIPLINES[0].value);
  const [specsText, setSpecsText] = useState("");
  const [shippingInfo, setShippingInfo] = useState(DEFAULT_SHIPPING_INFO);
  const [isNew, setIsNew] = useState(false);
  const [isPopular, setIsPopular] = useState(false);
  const [images, setImages] = useState<ImageField[]>([emptyImage()]);
  const [variants, setVariants] = useState<VariantField[]>([emptyVariant()]);

  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdProduct, setCreatedProduct] = useState<{
    slug: string;
    name: string;
  } | null>(null);

  const updateImage = (key: string, url: string) =>
    setImages((previous) =>
      previous.map((image) => (image.key === key ? { ...image, url } : image)),
    );

  const removeImage = (key: string) =>
    setImages((previous) => previous.filter((image) => image.key !== key));

  const updateVariant = (
    key: string,
    changes: Partial<Pick<VariantField, "size" | "color">>,
  ) =>
    setVariants((previous) =>
      previous.map((variant) =>
        variant.key === key ? { ...variant, ...changes } : variant,
      ),
    );

  const updateVariantStock = (key: string, storeId: string, value: string) =>
    setVariants((previous) =>
      previous.map((variant) =>
        variant.key === key
          ? {
              ...variant,
              stockByStore: { ...variant.stockByStore, [storeId]: value },
            }
          : variant,
      ),
    );

  const removeVariant = (key: string) =>
    setVariants((previous) =>
      previous.filter((variant) => variant.key !== key),
    );

  const showErrors = (messages: string[]) => {
    setErrors(messages);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const validate = (): string[] => {
    const problems: string[] = [];
    const parsedPrice = Number(price.replace(",", "."));

    if (name.trim() === "") problems.push("Le nom est obligatoire.");
    if (description.trim() === "")
      problems.push("La description est obligatoire.");
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      problems.push("Le prix doit être un nombre strictement positif.");
    }
    if (categoryId === "") problems.push("Choisissez une catégorie.");
    if (shippingInfo.trim() === "")
      problems.push("Les informations de retrait sont obligatoires.");

    const filledImages = images.filter((image) => image.url.trim() !== "");
    if (filledImages.length === 0) {
      problems.push("Ajoutez au moins une photo.");
    }
    if (filledImages.some((image) => !/^https?:\/\//i.test(image.url.trim()))) {
      problems.push(
        "Chaque photo doit être une adresse commençant par http:// ou https://.",
      );
    }

    const seenCombinations = new Set<string>();
    let totalStock = 0;

    variants.forEach((variant, index) => {
      const label = `Variante ${index + 1}`;
      const size = variant.size.trim();
      const color = variant.color.trim();

      if (size === "" || color === "") {
        problems.push(
          `${label} : la taille et la couleur sont obligatoires (saisissez « Unique » si elles ne s'appliquent pas).`,
        );
      } else {
        const combination = `${size.toLowerCase()}|${color.toLowerCase()}`;
        if (seenCombinations.has(combination)) {
          problems.push(
            `${label} : cette combinaison taille / couleur existe déjà.`,
          );
        }
        seenCombinations.add(combination);
      }

      stores.forEach((store) => {
        const quantity = parseStock(variant.stockByStore[store.id]);
        if (!Number.isInteger(quantity) || quantity < 0) {
          problems.push(
            `${label} : le stock de ${store.city} doit être un entier positif ou nul.`,
          );
        } else {
          totalStock += quantity;
        }
      });
    });

    if (totalStock === 0) {
      problems.push(
        "Au moins une variante doit avoir du stock dans au moins une boutique.",
      );
    }

    return problems;
  };

  const buildPayload = (): CreateProductPayload => ({
    name: name.trim(),
    description: description.trim(),
    price: Number(price.replace(",", ".")),
    collection,
    discipline,
    categoryId,
    specs: specsText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== ""),
    shippingInfo: shippingInfo.trim(),
    isNew,
    isPopular,
    images: images
      .filter((image) => image.url.trim() !== "")
      .map((image) => ({ url: image.url.trim() })),
    variants: variants.map((variant) => ({
      attributes: [
        { attributeName: "Taille", value: variant.size.trim() },
        { attributeName: "Couleur", value: variant.color.trim() },
      ],
      stockByStore: Object.fromEntries(
        stores.map((store) => [
          store.id,
          parseStock(variant.stockByStore[store.id]),
        ]),
      ),
    })),
  });

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setCategoryId("");
    setCollection(COLLECTIONS[0].value);
    setDiscipline(DISCIPLINES[0].value);
    setSpecsText("");
    setShippingInfo(DEFAULT_SHIPPING_INFO);
    setIsNew(false);
    setIsPopular(false);
    setImages([emptyImage()]);
    setVariants([emptyVariant()]);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setCreatedProduct(null);

    const problems = validate();
    if (problems.length > 0) {
      showErrors(problems);
      return;
    }

    setErrors([]);
    setIsSubmitting(true);

    try {
      const product: Product = await productsApi.create(buildPayload());
      setCreatedProduct({ slug: product.slug, name: product.name });
      resetForm();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      showErrors([
        error instanceof Error
          ? error.message
          : "La création du produit a échoué.",
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (areStoresLoading || areCategoriesLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h4" sx={{ fontSize: "1.5rem", mb: 0.5 }}>
        Ajouter un produit
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Le produit apparaît dans le catalogue dès qu'au moins une variante a du
        stock dans une boutique.
      </Typography>

      {createdProduct && (
        <Alert
          severity="success"
          sx={{ mb: 2 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => navigate(`/product/${createdProduct.slug}`)}
            >
              Voir la fiche
            </Button>
          }
        >
          Produit « {createdProduct.name} » créé.
        </Alert>
      )}

      {errors.length > 0 && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.map((message) => (
            <div key={message}>{message}</div>
          ))}
        </Alert>
      )}

      {stores.length === 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Impossible de charger les boutiques : le stock ne peut pas être saisi.
        </Alert>
      )}

      {categories.length === 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Impossible de charger les catégories : le produit ne peut pas être
          créé.
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Paper
            elevation={0}
            sx={{
              border: "1px solid rgba(0,0,0,0.1)",
              borderRadius: 1,
              p: 2.5,
            }}
          >
            <Typography variant="h4" sx={{ fontSize: "1.1rem", mb: 2 }}>
              Informations générales
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="Nom du produit"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                fullWidth
              />
              <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                multiline
                minRows={3}
                fullWidth
              />
              <TextField
                label="Prix (€)"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                fullWidth
                slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
              />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  select
                  label="Catégorie"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                  fullWidth
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  label="Collection"
                  value={collection}
                  onChange={(e) => setCollection(e.target.value)}
                  fullWidth
                >
                  {COLLECTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  label="Discipline"
                  value={discipline}
                  onChange={(e) => setDiscipline(e.target.value)}
                  fullWidth
                >
                  {DISCIPLINES.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>
              <TextField
                label="Caractéristiques techniques"
                helperText="Une caractéristique par ligne."
                value={specsText}
                onChange={(e) => setSpecsText(e.target.value)}
                multiline
                minRows={3}
                fullWidth
              />
              <TextField
                label="Informations de retrait"
                value={shippingInfo}
                onChange={(e) => setShippingInfo(e.target.value)}
                required
                multiline
                minRows={2}
                fullWidth
              />
              <Stack direction="row" spacing={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isNew}
                      onChange={(e) => setIsNew(e.target.checked)}
                    />
                  }
                  label="Nouveauté"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isPopular}
                      onChange={(e) => setIsPopular(e.target.checked)}
                    />
                  }
                  label="Populaire"
                />
              </Stack>
            </Stack>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              border: "1px solid rgba(0,0,0,0.1)",
              borderRadius: 1,
              p: 2.5,
            }}
          >
            <Typography variant="h4" sx={{ fontSize: "1.1rem", mb: 0.5 }}>
              Photos
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Adresses des images. La première est l'image principale.
            </Typography>
            <Stack spacing={1.5}>
              {images.map((image, index) => (
                <Stack
                  key={image.key}
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: "center" }}
                >
                  <TextField
                    label={`Photo ${index + 1}`}
                    value={image.url}
                    onChange={(e) => updateImage(image.key, e.target.value)}
                    fullWidth
                  />
                  <IconButton
                    aria-label={`Supprimer la photo ${index + 1}`}
                    disabled={images.length === 1}
                    onClick={() => removeImage(image.key)}
                  >
                    <DeleteOutlinedIcon />
                  </IconButton>
                </Stack>
              ))}
              <Box>
                <Button
                  startIcon={<AddIcon />}
                  onClick={() =>
                    setImages((previous) => [...previous, emptyImage()])
                  }
                  sx={{ textTransform: "none" }}
                >
                  Ajouter une photo
                </Button>
              </Box>
            </Stack>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              border: "1px solid rgba(0,0,0,0.1)",
              borderRadius: 1,
              p: 2.5,
            }}
          >
            <Typography variant="h4" sx={{ fontSize: "1.1rem", mb: 0.5 }}>
              Variantes et stock
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Une variante est une combinaison taille / couleur. Le stock se
              saisit séparément pour chaque boutique.
            </Typography>
            <Stack spacing={2}>
              {variants.map((variant, index) => (
                <Box
                  key={variant.key}
                  sx={{
                    border: "1px solid rgba(0,0,0,0.1)",
                    borderRadius: 1,
                    p: 2,
                  }}
                >
                  <Stack
                    direction="row"
                    sx={{
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1.5,
                    }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      Variante {index + 1}
                    </Typography>
                    <IconButton
                      aria-label={`Supprimer la variante ${index + 1}`}
                      disabled={variants.length === 1}
                      onClick={() => removeVariant(variant.key)}
                    >
                      <DeleteOutlinedIcon />
                    </IconButton>
                  </Stack>
                  <Stack spacing={2}>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                      <TextField
                        label="Taille"
                        value={variant.size}
                        onChange={(e) =>
                          updateVariant(variant.key, { size: e.target.value })
                        }
                        fullWidth
                      />
                      <TextField
                        label="Couleur"
                        value={variant.color}
                        onChange={(e) =>
                          updateVariant(variant.key, { color: e.target.value })
                        }
                        fullWidth
                      />
                    </Stack>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Stock par boutique
                    </Typography>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                      {stores.map((store) => (
                        <TextField
                          key={store.id}
                          label={store.city}
                          type="number"
                          value={variant.stockByStore[store.id] ?? ""}
                          onChange={(e) =>
                            updateVariantStock(
                              variant.key,
                              store.id,
                              e.target.value,
                            )
                          }
                          fullWidth
                          slotProps={{ htmlInput: { min: 0, step: 1 } }}
                        />
                      ))}
                    </Stack>
                  </Stack>
                </Box>
              ))}
              <Box>
                <Button
                  startIcon={<AddIcon />}
                  onClick={() =>
                    setVariants((previous) => [...previous, emptyVariant()])
                  }
                  sx={{ textTransform: "none" }}
                >
                  Ajouter une variante
                </Button>
              </Box>
            </Stack>
          </Paper>

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={
              isSubmitting || stores.length === 0 || categories.length === 0
            }
          >
            {isSubmitting ? "Création en cours..." : "Créer le produit"}
          </Button>
        </Stack>
      </form>
    </Box>
  );
};
