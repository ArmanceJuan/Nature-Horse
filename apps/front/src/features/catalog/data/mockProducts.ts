import type { Product } from "../types/product.types.js";

const SHIPPING_INFO =
  "Livraison à domicile sous 3-5 jours ouvrés, ou click & collect disponible 1h après validation de la commande.";

export const mockProducts: Product[] = [
  {
    id: "veste-performance-1",
    name: "Veste Performance Isotherme",
    collection: "textile-performance",
    price: 189,
    imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600",
    description:
      "Veste technique isotherme conçue pour les longues sessions d'entraînement par temps froid.",
    specs: [
      "Membrane respirante 3 couches",
      "Coutures thermosoudées",
      "Poches zippées étanches",
      "Doublure polaire amovible",
    ],
    shippingInfo: SHIPPING_INFO,
    variants: [
      {
        size: "S",
        color: "Noir",
        stockByStore: { "isle-sur-la-sorgue": 3, "saint-cannat": 0 },
      },
      {
        size: "M",
        color: "Noir",
        stockByStore: { "isle-sur-la-sorgue": 5, "saint-cannat": 2 },
      },
    ],
    isNew: true,
    isPopular: false,
  },
  {
    id: "selle-monolith-1",
    name: "Selle Monolith Veau",
    collection: "haute-sellerie",
    price: 2450,
    imageUrl: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=600",
    description:
      "Selle d'obstacle en cuir de veau pleine fleur, arçon flexible et matelassage sur mesure.",
    specs: [
      "Cuir de veau pleine fleur",
      "Arçon flexible en bois et fibre",
      "Quartiers longs",
      "Sanglage court en Y",
    ],
    shippingInfo: SHIPPING_INFO,
    variants: [
      {
        size: "17.5",
        color: "Havane",
        stockByStore: { "isle-sur-la-sorgue": 1, "saint-cannat": 1 },
      },
    ],
    isNew: false,
    isPopular: true,
  },
  {
    id: "polo-technique-1",
    name: "Polo Technique Respirant",
    collection: "textile-performance",
    price: 65,
    imageUrl:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600",
    description:
      "Polo léger en maille technique, idéal pour l'entraînement quotidien.",
    specs: [
      "Tissu anti-transpirant",
      "Col zippé",
      "Coupe ajustée",
      "Traitement anti-UV",
    ],
    shippingInfo: SHIPPING_INFO,
    variants: [
      {
        size: "S",
        color: "Blanc",
        stockByStore: { "isle-sur-la-sorgue": 8, "saint-cannat": 4 },
      },
      {
        size: "M",
        color: "Blanc",
        stockByStore: { "isle-sur-la-sorgue": 6, "saint-cannat": 0 },
      },
    ],
    isNew: true,
    isPopular: true,
  },
  {
    id: "bombers-cuir-1",
    name: "Bombers Cuir Équitation",
    collection: "textile-performance",
    price: 245,
    imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=601",
    description:
      "Bombers en cuir souple, coupe intemporelle pour un usage quotidien.",
    specs: [
      "Cuir d'agneau souple",
      "Doublure satinée",
      "Fermeture zippée",
      "Poches intérieures",
    ],
    shippingInfo: SHIPPING_INFO,
    variants: [
      {
        size: "M",
        color: "Noir",
        stockByStore: { "isle-sur-la-sorgue": 2, "saint-cannat": 1 },
      },
    ],
    isNew: true,
    isPopular: true,
  },
  {
    id: "etrivieres-cuir-1",
    name: "Étrivières Cuir Premium",
    collection: "haute-sellerie",
    price: 95,
    imageUrl: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=601",
    description: "Étrivières en cuir tressé, résistance et confort renforcés.",
    specs: [
      "Cuir tressé nerveux",
      "Trous renforcés",
      "Longueur 140cm",
      "Finition havane",
    ],
    shippingInfo: SHIPPING_INFO,
    variants: [
      {
        size: "Unique",
        color: "Havane",
        stockByStore: { "isle-sur-la-sorgue": 4, "saint-cannat": 3 },
      },
    ],
    isNew: false,
    isPopular: true,
  },
  {
    id: "pantalon-equitation-1",
    name: "Pantalon d'Équitation Grip",
    collection: "textile-performance",
    price: 129,
    imageUrl:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=601",
    description:
      "Pantalon technique avec empiècements silicone pour une meilleure adhérence en selle.",
    specs: [
      "Empiècements silicone genoux",
      "Taille haute",
      "Tissu 4 sens stretch",
      "Poches zippées",
    ],
    shippingInfo: SHIPPING_INFO,
    variants: [
      {
        size: "36",
        color: "Marine",
        stockByStore: { "isle-sur-la-sorgue": 5, "saint-cannat": 2 },
      },
      {
        size: "38",
        color: "Marine",
        stockByStore: { "isle-sur-la-sorgue": 3, "saint-cannat": 0 },
      },
    ],
    isNew: false,
    isPopular: false,
  },
  {
    id: "bombe-equitation-1",
    name: "Bombe d'Équitation Ventilée",
    collection: "textile-performance",
    price: 175,
    imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=602",
    description: "Casque d'équitation certifié, système de ventilation avancé.",
    specs: [
      "Certification VG1",
      "Ventilation active",
      "Réglage molette",
      "Coque ABS",
    ],
    shippingInfo: SHIPPING_INFO,
    variants: [
      {
        size: "55-56",
        color: "Noir mat",
        stockByStore: { "isle-sur-la-sorgue": 6, "saint-cannat": 3 },
      },
      {
        size: "57-58",
        color: "Noir mat",
        stockByStore: { "isle-sur-la-sorgue": 4, "saint-cannat": 2 },
      },
    ],
    isNew: true,
    isPopular: true,
  },
  {
    id: "bridon-cuir-1",
    name: "Bridon Anatomique Cuir",
    collection: "haute-sellerie",
    price: 155,
    imageUrl: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=602",
    description:
      "Bridon ergonomique conçu pour répartir la pression et le confort du cheval.",
    specs: [
      "Cuir anatomique matelassé",
      "Muserolle française",
      "Boucles inox",
      "Rênes incluses",
    ],
    shippingInfo: SHIPPING_INFO,
    variants: [
      {
        size: "Cheval",
        color: "Noir",
        stockByStore: { "isle-sur-la-sorgue": 3, "saint-cannat": 2 },
      },
    ],
    isNew: false,
    isPopular: false,
  },
  {
    id: "tapis-dressage-1",
    name: "Tapis de Dressage Mémoire de Forme",
    collection: "haute-sellerie",
    price: 89,
    imageUrl: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=603",
    description:
      "Tapis technique à mousse mémoire de forme, absorption des chocs optimisée.",
    specs: [
      "Mousse mémoire de forme",
      "Dos matelassé",
      "Sangles élastiques",
      "Lavable en machine",
    ],
    shippingInfo: SHIPPING_INFO,
    variants: [
      {
        size: "Poney",
        color: "Blanc",
        stockByStore: { "isle-sur-la-sorgue": 7, "saint-cannat": 5 },
      },
      {
        size: "Cheval",
        color: "Blanc",
        stockByStore: { "isle-sur-la-sorgue": 6, "saint-cannat": 0 },
      },
    ],
    isNew: false,
    isPopular: true,
  },
  {
    id: "guetres-protection-1",
    name: "Guêtres de Protection Néoprène",
    collection: "haute-sellerie",
    price: 55,
    imageUrl: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=604",
    description:
      "Guêtres souples en néoprène pour la protection des membres à l'entraînement.",
    specs: [
      "Néoprène 5mm",
      "Fermeture velcro double",
      "Doublure anti-frottement",
      "Vendues par paire",
    ],
    shippingInfo: SHIPPING_INFO,
    variants: [
      {
        size: "Cheval",
        color: "Noir",
        stockByStore: { "isle-sur-la-sorgue": 9, "saint-cannat": 6 },
      },
    ],
    isNew: false,
    isPopular: false,
  },
  {
    id: "chemise-concours-1",
    name: "Chemise de Concours Technique",
    collection: "textile-performance",
    price: 79,
    imageUrl:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=602",
    description:
      "Chemise de compétition en tissu respirant, col compatible cravate de concours.",
    specs: [
      "Tissu technique anti-humidité",
      "Col rigide amovible",
      "Coupe cintrée",
      "Manches longues",
    ],
    shippingInfo: SHIPPING_INFO,
    variants: [
      {
        size: "S",
        color: "Blanc",
        stockByStore: { "isle-sur-la-sorgue": 4, "saint-cannat": 3 },
      },
      {
        size: "M",
        color: "Blanc",
        stockByStore: { "isle-sur-la-sorgue": 2, "saint-cannat": 1 },
      },
    ],
    isNew: true,
    isPopular: false,
  },
  {
    id: "gilet-sans-manches-1",
    name: "Gilet Sans Manches Matelassé",
    collection: "textile-performance",
    price: 99,
    imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=603",
    description: "Gilet léger matelassé, parfait pour les journées mi-saison.",
    specs: [
      "Matelassage léger",
      "Col montant",
      "Poches zippées",
      "Coupe droite",
    ],
    shippingInfo: SHIPPING_INFO,
    variants: [
      {
        size: "M",
        color: "Kaki",
        stockByStore: { "isle-sur-la-sorgue": 5, "saint-cannat": 4 },
      },
    ],
    isNew: false,
    isPopular: false,
  },
  {
    id: "cravache-carbone-1",
    name: "Cravache Carbone Compétition",
    collection: "haute-sellerie",
    price: 45,
    imageUrl: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=605",
    description:
      "Cravache légère en fibre de carbone, poignée cuir cousue main.",
    specs: [
      "Fibre de carbone",
      "Poignée cuir cousue main",
      "Longueur 75cm",
      "Dragonne incluse",
    ],
    shippingInfo: SHIPPING_INFO,
    variants: [
      {
        size: "Unique",
        color: "Noir",
        stockByStore: { "isle-sur-la-sorgue": 10, "saint-cannat": 8 },
      },
    ],
    isNew: false,
    isPopular: false,
  },
  {
    id: "bottes-cuir-1",
    name: "Bottes d'Équitation Cuir Veau",
    collection: "haute-sellerie",
    price: 495,
    imageUrl: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=606",
    description:
      "Bottes hautes en cuir de veau, tige ajustée sur mesure, semelle technique.",
    specs: [
      "Cuir de veau pleine fleur",
      "Tige ajustable",
      "Semelle antidérapante",
      "Fermeture zip intérieur",
    ],
    shippingInfo: SHIPPING_INFO,
    variants: [
      {
        size: "38",
        color: "Noir",
        stockByStore: { "isle-sur-la-sorgue": 2, "saint-cannat": 1 },
      },
      {
        size: "39",
        color: "Noir",
        stockByStore: { "isle-sur-la-sorgue": 1, "saint-cannat": 0 },
      },
    ],
    isNew: true,
    isPopular: true,
  },
  {
    id: "couvre-reins-1",
    name: "Couvre-Reins Polaire",
    collection: "haute-sellerie",
    price: 39,
    imageUrl: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=607",
    description:
      "Couvre-reins en polaire pour l'échauffement et la récupération.",
    specs: [
      "Polaire 300g/m²",
      "Sangle élastique",
      "Séchage rapide",
      "Lavable en machine",
    ],
    shippingInfo: SHIPPING_INFO,
    variants: [
      {
        size: "Cheval",
        color: "Gris",
        stockByStore: { "isle-sur-la-sorgue": 6, "saint-cannat": 5 },
      },
    ],
    isNew: false,
    isPopular: false,
  },
  {
    id: "gants-equitation-1",
    name: "Gants d'Équitation Grip Technique",
    collection: "textile-performance",
    price: 29,
    imageUrl:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=603",
    description:
      "Gants légers avec paume renforcée pour une meilleure tenue des rênes.",
    specs: [
      "Paume silicone",
      "Tissu extensible",
      "Fermeture velcro poignet",
      "Respirant",
    ],
    shippingInfo: SHIPPING_INFO,
    variants: [
      {
        size: "S",
        color: "Noir",
        stockByStore: { "isle-sur-la-sorgue": 12, "saint-cannat": 9 },
      },
      {
        size: "M",
        color: "Noir",
        stockByStore: { "isle-sur-la-sorgue": 10, "saint-cannat": 7 },
      },
    ],
    isNew: false,
    isPopular: true,
  },
  {
    id: "selle-dressage-1",
    name: "Selle de Dressage Confort",
    collection: "haute-sellerie",
    price: 1980,
    imageUrl: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=608",
    description:
      "Selle de dressage à quartiers longs, contact profond et stable.",
    specs: [
      "Cuir français",
      "Arçon interchangeable",
      "Quartiers longs droits",
      "Matelassage genouillères",
    ],
    shippingInfo: SHIPPING_INFO,
    variants: [
      {
        size: "17",
        color: "Noir",
        stockByStore: { "isle-sur-la-sorgue": 1, "saint-cannat": 1 },
      },
    ],
    isNew: false,
    isPopular: false,
  },
  {
    id: "chaps-cuir-1",
    name: "Chaps Cuir Ajustables",
    collection: "haute-sellerie",
    price: 119,
    imageUrl: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=609",
    description:
      "Chaps en cuir souple, protection et esthétique pour l'entraînement.",
    specs: [
      "Cuir souple pleine fleur",
      "Fermeture zip + velcro",
      "Doublure respirante",
      "Ajustable mollet",
    ],
    shippingInfo: SHIPPING_INFO,
    variants: [
      {
        size: "M",
        color: "Marron",
        stockByStore: { "isle-sur-la-sorgue": 3, "saint-cannat": 2 },
      },
    ],
    isNew: true,
    isPopular: false,
  },
  {
    id: "sursangle-1",
    name: "Sursangle Élastique Renforcée",
    collection: "haute-sellerie",
    price: 35,
    imageUrl: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=610",
    description:
      "Sursangle avec panneaux élastiques pour un confort optimal du cheval.",
    specs: [
      "Élastiques doubles",
      "Boucles inox",
      "Doublure néoprène",
      "Longueur 160cm",
    ],
    shippingInfo: SHIPPING_INFO,
    variants: [
      {
        size: "Cheval",
        color: "Noir",
        stockByStore: { "isle-sur-la-sorgue": 8, "saint-cannat": 6 },
      },
    ],
    isNew: false,
    isPopular: false,
  },
  {
    id: "veste-concours-1",
    name: "Veste de Concours Stretch",
    collection: "textile-performance",
    price: 220,
    imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=604",
    description:
      "Veste de compétition en tissu stretch technique, coupe cintrée réglementaire.",
    specs: [
      "Tissu 4 sens stretch",
      "Doublure respirante",
      "Coutures renforcées",
      "Conforme FFE",
    ],
    shippingInfo: SHIPPING_INFO,
    variants: [
      {
        size: "38",
        color: "Marine",
        stockByStore: { "isle-sur-la-sorgue": 2, "saint-cannat": 1 },
      },
      {
        size: "40",
        color: "Marine",
        stockByStore: { "isle-sur-la-sorgue": 1, "saint-cannat": 0 },
      },
    ],
    isNew: true,
    isPopular: false,
  },
  {
    id: "brosse-etrille-1",
    name: "Kit de Pansage Complet",
    collection: "haute-sellerie",
    price: 42,
    imageUrl: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=611",
    description: "Kit complet de pansage avec étrille, brosses et cure-pieds.",
    specs: [
      "5 pièces incluses",
      "Manches ergonomiques",
      "Poils naturels et synthétiques",
      "Sac de rangement inclus",
    ],
    shippingInfo: SHIPPING_INFO,
    variants: [
      {
        size: "Unique",
        color: "Multicolore",
        stockByStore: { "isle-sur-la-sorgue": 15, "saint-cannat": 10 },
      },
    ],
    isNew: false,
    isPopular: true,
  },
  {
    id: "collier-chien-1",
    name: "Collier Chien Cuir Tressé",
    collection: "haute-sellerie",
    price: 25,
    imageUrl: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=612",
    description:
      "Collier en cuir tressé, robuste et confortable pour chien de ferme ou de compagnie.",
    specs: [
      "Cuir tressé main",
      "Boucle réglable",
      "Anneau inox",
      "Tailles S à L",
    ],
    shippingInfo: SHIPPING_INFO,
    variants: [
      {
        size: "S",
        color: "Marron",
        stockByStore: { "isle-sur-la-sorgue": 6, "saint-cannat": 4 },
      },
      {
        size: "M",
        color: "Marron",
        stockByStore: { "isle-sur-la-sorgue": 5, "saint-cannat": 3 },
      },
    ],
    isNew: false,
    isPopular: false,
  },
  {
    id: "manteau-chien-1",
    name: "Manteau Chien Imperméable",
    collection: "textile-performance",
    price: 49,
    imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=605",
    description:
      "Manteau imperméable et coupe-vent pour les sorties par temps difficile.",
    specs: [
      "Tissu imperméable",
      "Doublure polaire",
      "Réglable sangles ventrales",
      "Bande réfléchissante",
    ],
    shippingInfo: SHIPPING_INFO,
    variants: [
      {
        size: "M",
        color: "Noir",
        stockByStore: { "isle-sur-la-sorgue": 7, "saint-cannat": 5 },
      },
    ],
    isNew: true,
    isPopular: false,
  },
  {
    id: "longe-cheval-1",
    name: "Longe Cheval Coton Tressé",
    collection: "haute-sellerie",
    price: 32,
    imageUrl: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=613",
    description:
      "Longe en coton tressé, prise en main confortable pour le travail à pied.",
    specs: [
      "Coton tressé 8m",
      "Mousqueton laiton",
      "Anneau coulissant",
      "Résistant à l'usure",
    ],
    shippingInfo: SHIPPING_INFO,
    variants: [
      {
        size: "Unique",
        color: "Beige",
        stockByStore: { "isle-sur-la-sorgue": 9, "saint-cannat": 7 },
      },
    ],
    isNew: false,
    isPopular: false,
  },
  {
    id: "spray-soin-1",
    name: "Spray Démêlant Crinière",
    collection: "haute-sellerie",
    price: 18,
    imageUrl: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=614",
    description: "Spray démêlant et brillance pour crinière et queue.",
    specs: ["Formule sans rinçage", "Anti-UV", "500ml", "Sans silicone"],
    shippingInfo: SHIPPING_INFO,
    variants: [
      {
        size: "500ml",
        color: "-",
        stockByStore: { "isle-sur-la-sorgue": 20, "saint-cannat": 14 },
      },
    ],
    isNew: false,
    isPopular: true,
  },
  {
    id: "chaussettes-equitation-1",
    name: "Chaussettes Techniques Équitation",
    collection: "textile-performance",
    price: 15,
    imageUrl:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=604",
    description: "Chaussettes hautes techniques, zones de compression ciblées.",
    specs: [
      "Fibre technique anti-ampoules",
      "Zones de compression",
      "Renfort talon",
      "Lot de 2 paires",
    ],
    shippingInfo: SHIPPING_INFO,
    variants: [
      {
        size: "36-38",
        color: "Blanc",
        stockByStore: { "isle-sur-la-sorgue": 14, "saint-cannat": 10 },
      },
      {
        size: "39-41",
        color: "Blanc",
        stockByStore: { "isle-sur-la-sorgue": 12, "saint-cannat": 8 },
      },
    ],
    isNew: false,
    isPopular: false,
  },
  {
    id: "cool-pack-1",
    name: "Guêtres Rafraîchissantes Gel",
    collection: "haute-sellerie",
    price: 65,
    imageUrl: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=615",
    description: "Guêtres à gel réfrigérant pour la récupération après effort.",
    specs: [
      "Gel réfrigérant intégré",
      "Fermeture velcro",
      "Réutilisable",
      "Vendues par paire",
    ],
    shippingInfo: SHIPPING_INFO,
    variants: [
      {
        size: "Cheval",
        color: "Bleu",
        stockByStore: { "isle-sur-la-sorgue": 4, "saint-cannat": 3 },
      },
    ],
    isNew: true,
    isPopular: false,
  },
  {
    id: "ceinture-cuir-1",
    name: "Ceinture Cuir Boucle Étrier",
    collection: "haute-sellerie",
    price: 55,
    imageUrl: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=616",
    description: "Ceinture en cuir pleine fleur, boucle en forme d'étrier.",
    specs: [
      "Cuir pleine fleur",
      "Boucle laiton massif",
      "Largeur 3.5cm",
      "Fabrication artisanale",
    ],
    shippingInfo: SHIPPING_INFO,
    variants: [
      {
        size: "85",
        color: "Noir",
        stockByStore: { "isle-sur-la-sorgue": 5, "saint-cannat": 3 },
      },
    ],
    isNew: false,
    isPopular: false,
  },
  {
    id: "sac-cavaliere-1",
    name: "Sac de Sport Cavalière",
    collection: "textile-performance",
    price: 85,
    imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=606",
    description:
      "Sac de sport spacieux avec compartiment dédié pour les bottes.",
    specs: [
      "Compartiment bottes séparé",
      "Poche chaussures ventilée",
      "Bandoulière réglable",
      "40L",
    ],
    shippingInfo: SHIPPING_INFO,
    variants: [
      {
        size: "Unique",
        color: "Bordeaux",
        stockByStore: { "isle-sur-la-sorgue": 6, "saint-cannat": 4 },
      },
    ],
    isNew: true,
    isPopular: true,
  },
  {
    id: "protection-boulet-1",
    name: "Protections Boulets Néoprène",
    collection: "haute-sellerie",
    price: 38,
    imageUrl: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=617",
    description:
      "Protections légères pour les boulets à l'entraînement quotidien.",
    specs: [
      "Néoprène 4mm",
      "Fermeture velcro simple",
      "Léger et respirant",
      "Vendues par paire",
    ],
    shippingInfo: SHIPPING_INFO,
    variants: [
      {
        size: "Cheval",
        color: "Noir",
        stockByStore: { "isle-sur-la-sorgue": 11, "saint-cannat": 8 },
      },
    ],
    isNew: false,
    isPopular: false,
  },
  {
    id: "casquette-marque-1",
    name: "Casquette Nature Horse",
    collection: "textile-performance",
    price: 25,
    imageUrl:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=605",
    description: "Casquette brodée, coton bio, réglage arrière ajustable.",
    specs: [
      "Coton bio",
      "Broderie logo",
      "Réglage sangle arrière",
      "Une taille",
    ],
    shippingInfo: SHIPPING_INFO,
    variants: [
      {
        size: "Unique",
        color: "Beige",
        stockByStore: { "isle-sur-la-sorgue": 18, "saint-cannat": 12 },
      },
    ],
    isNew: true,
    isPopular: true,
  },
  {
    id: "panier-chat-1",
    name: "Panier Chat Douillet",
    collection: "haute-sellerie",
    price: 45,
    imageUrl: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=618",
    description:
      "Panier moelleux et déhoussable pour le confort de votre chat.",
    specs: [
      "Coussin déhoussable",
      "Lavable en machine",
      "Rebords surélevés",
      "Diamètre 45cm",
    ],
    shippingInfo: SHIPPING_INFO,
    variants: [
      {
        size: "Unique",
        color: "Gris",
        stockByStore: { "isle-sur-la-sorgue": 5, "saint-cannat": 4 },
      },
    ],
    isNew: false,
    isPopular: false,
  },
];
