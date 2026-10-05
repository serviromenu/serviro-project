import DefaultTemplate from "./DefaultTemplate";
import ClassicTemplate from "./ClassicTemplate";
import MoonTemplate from "./MoonTemplate";

interface TemplateRendererProps {
  templateName?: string;
  [key: string]: any;
}

export default function TemplateRenderer({
  templateName = "default",
  ...props
}: TemplateRendererProps) {
  switch (templateName) {
    case "classic":
      return <ClassicTemplate {...(props as any)} />;
    case "moon":
      return <MoonTemplate {...(props as any)} />;
    case "default":
    default:
      return <DefaultTemplate {...(props as any)} />;
  }
}