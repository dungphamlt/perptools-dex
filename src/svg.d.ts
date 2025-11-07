declare module "*.svg" {
  import React from "react";
  const SVG: React.FC<React.SVGProps<SVGSVGElement> & { className?: string }>;
  export default SVG;
}

declare module "*.svg?url" {
  const url: string;
  export default url;
}
