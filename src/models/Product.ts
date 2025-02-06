export enum Category {
  ART = "ART",
  BIOGRAPHY = "BIOGRAPHY",
  CHILDREN = "CHILDREN",
  COOKING = "COOKING",
  DETECTIVE = "DETECTIVE",
  EDUCATION = "EDUCATION",
  FANTASY = "FANTASY",
  HISTORY = "HISTORY",
  HORROR = "HORROR",
  MYSTERY = "MYSTERY",
  POETRY = "POETRY",
  ROMANCE = "ROMANCE",
  SCIENCE = "SCIENCE",
  SCIENCE_FICTION = "SCIENCE_FICTION",
  TRAVEL = "TRAVEL"
}

export class Product {
  id?: number;
  productName: string;
  productPrice: number;
  productQuantity: number;
  productAvailability: boolean;
  productImage: string;
  productCategory: Category;
  productAuthor: string;
  productDescription: string;

  constructor(
    productName: string,
    productPrice: number,
    productQuantity: number,
    productImage: string,
    productCategory: Category,
    productAuthor: string,
    productDescription: string
  ) {
    this.productName = productName;
    this.productPrice = productPrice;
    this.productQuantity = productQuantity;
    this.productImage = productImage;
    this.productCategory = productCategory;
    this.productAuthor = productAuthor;
    this.productDescription = productDescription;
    this.productAvailability = productQuantity > 0;
  }

  getProductAvailability(): boolean {
    return this.productAvailability;
  }
}
