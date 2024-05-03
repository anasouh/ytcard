import CardEditor from "@/components/CardEditor";
import { ChakraProvider } from "@chakra-ui/react";

function ToolPage() {
  return (
    <ChakraProvider>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="stylesheet" href="/assets/css/style.css" />
      <CardEditor />
    </ChakraProvider>
  );
}

export default ToolPage;
