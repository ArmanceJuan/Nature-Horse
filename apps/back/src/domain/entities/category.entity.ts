export interface CategoryProps {
  id: string;
  slug: string;
  name: string;
  position: number;
}

export class Category {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly position: number;

  constructor(props: CategoryProps) {
    this.id = props.id;
    this.slug = props.slug;
    this.name = props.name;
    this.position = props.position;
  }
}
