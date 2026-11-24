import type { ProductResponse } from "../types/product";

const API_URL = "https://dummyjson.com/products";

export async function getProducts(): Promise<ProductResponse> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const data: ProductResponse = await response.json();

  return data;
}