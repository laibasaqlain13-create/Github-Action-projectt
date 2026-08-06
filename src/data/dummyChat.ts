export const dummyArtisans = [
  { id: 1, name: "Ayesha Khan", category: "Embroidery", image: "" },
  { id: 2, name: "Fatima Crafts", category: "Zardozi", image: "" },
  { id: 3, name: "Sara Handmade", category: "Crochet", image: "" },
];

export const dummyCustomers = [
  { id: 1, name: "Ali Ahmed", lastMessage: "Hello, I want embroidery work." },
  { id: 2, name: "Sara Khan", lastMessage: "I need details about your services." },
  { id: 3, name: "Ahmed Raza", lastMessage: "Can you help me?" },
];

export const dummyMessages = [
  { sender: "customer" as const, text: "Hello, I need embroidery service." },
  { sender: "artisan" as const, text: "Sure, I can help you." },
];
