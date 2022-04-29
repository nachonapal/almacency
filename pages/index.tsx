import React, { useMemo, useState } from "react";
import { GetStaticProps } from "next";
import { Product } from "../products/types";
import api from "../products/api";
import { Button, Grid, Link, Stack, Text } from "@chakra-ui/react";
import Head from "next/head";

interface Props {
  products: Product[];
}
//Variables en segundos para llamar a la revalidacion de los datos del sheets
const tresVecesAlDia = (3600 * 24) / 3;

function parseCurrency(value: number): string {
  return value.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
  });
}

const IndexRoute: React.FC<Props> = ({ products }) => {
  const [cart, setCart] = useState<Product[]>([]);
  const whatsappMessage = useMemo(() => {
    return cart
      .reduce(
        (message, product) =>
          message.concat(
            `*${product.title}* ${parseCurrency(product.price)}\n`
          ),
        ``
      )
      .concat(
        `\n*Total* : ${parseCurrency(
          cart.reduce((total, product) => total + product.price, 0)
        )}`
      );
  }, [cart]);

  return (
    <Stack>
      <Grid gridGap={6} templateColumns="repeat(auto-fill, minmax(240px,1fr))">
        {products.map((product) => {
          return (
            <Stack bgColor={"gray.100"} key={product.id}>
              <Text>{product.title}</Text>
              <Text>{`${parseCurrency(product.price)}`}</Text>
              <Button
                onClick={() => setCart(cart.concat(product))}
                colorScheme="blue"
              >
                Agregar
              </Button>
            </Stack>
          );
        })}
      </Grid>
      {cart.length && (
        <Button
          isExternal
          as={Link}
          href={`https://wa.me/543512830134?text=${encodeURIComponent(
            whatsappMessage
          )}`}
          colorScheme={"whatsapp"}
        >
          Completar pedido ({cart.length} productos)
        </Button>
      )}
    </Stack>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const products = await api.list();

  return {
    props: {
      products,
    },
    //Llama a getStaticProps 3 veces x dia. Hasta la proxima llamada, queda guardado en cache los datos de la anterior
    revalidate: tresVecesAlDia,
  };
};
export default IndexRoute;
