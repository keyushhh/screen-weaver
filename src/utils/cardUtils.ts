export interface Card {
  id: string;
  number: string;
  holder: string;
  expiry: string;
  type: "visa" | "mastercard" | "rupay" | null;
  isDefault: boolean;
  backgroundIndex: number;
}

const STORAGE_KEY = "dotpe_user_cards";

export const getCards = (): Card[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to load cards", e);
    return [];
  }
};

export const addCard = (card: Omit<Card, "id" | "isDefault" | "backgroundIndex">): Card => {
  const currentCards = getCards();

  // New card logic
  const newCard: Card = {
    ...card,
    id: Date.now().toString(),
    // First card is default
    isDefault: currentCards.length === 0,
    // Assign a background index (1-6) based on count
    backgroundIndex: (currentCards.length % 6) + 1
  };

  const updatedCards = [...currentCards, newCard];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCards));
  return newCard;
};

export const removeCard = (id: string): void => {
  const currentCards = getCards();
  const removedCard = currentCards.find(c => c.id === id);

  // Filter out the card
  const updatedCards = currentCards.filter(c => c.id !== id);

  // If we removed the default card, make the new first one default
  if (removedCard?.isDefault && updatedCards.length > 0) {
      updatedCards[0].isDefault = true;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCards));
};

export const setDefaultCard = (id: string): void => {
    const currentCards = getCards();
    const updatedCards = currentCards.map(c => ({
        ...c,
        isDefault: c.id === id
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCards));
};
