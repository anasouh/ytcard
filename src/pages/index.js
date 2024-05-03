import CardEditor from "@/components/CardEditor";
import NextLink from "next/link";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { ChakraProvider, Link, Stack, Text } from "@chakra-ui/react";

function ToolPage() {
  return (
    <ChakraProvider>
      <title>YouTube Card Generator</title>
      <meta
        name="description"
        content="Generate YouTube cards for your videos."
      />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="stylesheet" href="/assets/css/style.css" />
      <main className="flex-column screen-height align-center justify-center gap-50">
        <Stack spacing={4}>
          <Text as="h1" fontSize="3xl" fontWeight="bold" textAlign="center">
            YouTube Card Generator
          </Text>
          <Text as="p" textAlign="center" fontStyle="italic">
            Not designed for mobile yet.
          </Text>
        </Stack>
        <CardEditor />
        <Stack spacing={4}>
          <Text as="p" textAlign="center">
            Made by{" "}
            <Link
              as={NextLink}
              href="https://github.com/anasouh"
              isExternal
              color={"red.500"}
            >
              Anas <ExternalLinkIcon mx="2px" />
            </Link>
          </Text>
        </Stack>
      </main>
    </ChakraProvider>
  );
}

export default ToolPage;
