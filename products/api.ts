import axios from "axios";
import Papa from "papaparse";
import { Product } from "./types";
import { SHEET_URL } from "../constants";

export default {
  list: async (): Promise<Product[]> => {
    return axios
      .get(SHEET_URL, {
        responseType: "blob",
      })
      .then(
        (response) =>
          new Promise<Product[]>((resolve, reject) => {
            Papa.parse(response.data, {
              header: true,
              complete: (results) => {
                const products = results.data as Product[];
                return resolve(
                  products.map((product) => ({
                    ...product,
                    price: Number(product.price),
                  }))
                );
              },
              error: (error) => reject(error),
            });
          })
      );
  },
};
