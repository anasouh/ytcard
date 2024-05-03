import CardEditor from "@/components/CardEditor";
import { ChakraProvider } from "@chakra-ui/react";

function ToolPage() {
  return (
    <ChakraProvider>
      <link rel="stylesheet" href="/assets/css/style.css" />
      <CardEditor />
    </ChakraProvider>
  );
}

export default ToolPage;
