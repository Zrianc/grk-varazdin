import { notFound } from "next/navigation";
import Shell from "@/components/admin/Shell";
import CollectionEditor from "@/components/admin/CollectionEditor";
import JsonEditor from "@/components/admin/JsonEditor";
import { ADMIN_NAV, OBJECT_EDITORS, SCHEMAS } from "@/lib/admin-schema";
import { read } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ collection: string }> }) {
  const { collection } = await params;
  const schema = SCHEMAS.find((s) => s.key === collection);
  const obj = OBJECT_EDITORS.find((o) => o.key === collection);
  if (!schema && !obj) notFound();
  const data = await read((schema ?? obj)!.key);
  return (
    <Shell nav={ADMIN_NAV}>
      <div className="pt-4">
        {schema ? (
          <CollectionEditor key={schema.key} schema={schema} initial={data as never} />
        ) : (
          <JsonEditor k={obj!.key} label={obj!.label} help={obj!.help} initial={data} />
        )}
      </div>
    </Shell>
  );
}
