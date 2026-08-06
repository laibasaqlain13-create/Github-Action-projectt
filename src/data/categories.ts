export type Category = {
  name: string;
  route: string;
  description: string;
  image: string;
};

export const categories: Category[] = [
  { name: "Machine Stitching", route: "machine-stitching", description: "Professional tailoring and custom garment stitching.", image: "/images/categories/machine-stitching.jpg" },
  { name: "Embroidery", route: "embroidery", description: "Beautiful hand and machine embroidered designs.", image: "/images/categories/embroidery.jpg" },
  { name: "Zardozi", route: "zardozi", description: "Traditional gold and silver thread embroidery.", image: "/images/categories/zardozi.jpg" },
  { name: "Applique", route: "applique", description: "Creative fabric patchwork with artistic designs.", image: "/images/aplique.jpg" },
  { name: "Crochet", route: "crochet", description: "Handmade crochet accessories, clothing, and decor.", image: "/images/categories/crochet.jpg" },
  { name: "Fabric Painting", route: "fabric-painting", description: "Unique hand-painted fabrics and textile art.", image: "/images/categories/fabric-painting.jpg" },
  { name: "Mirror Work", route: "mirror-work", description: "Traditional mirror embroidery for vibrant ethnic wear.", image: "/images/categories/mirror-work.jpg" },
  { name: "Lace Trims", route: "lace-trims", description: "Decorative lace borders for dresses and crafts.", image: "/images/categories/embroidery.jpg" },
];
