import { getCollections } from "@/lib/data";
import CollectionsClient from "@/components/CollectionsClient";

export const dynamic = "force-dynamic";

export default async function CollectionsPage() {
  const collections = await getCollections();
  return <CollectionsClient collections={JSON.parse(JSON.stringify(collections))} />;
}
