export type Lang = "en" | "ru";

const translations = {
  en: {
    // Tab bar
    tabHome: "Home",
    tabMenu: "Menu",
    tabCart: "Cart",
    tabProfile: "Profile",

    // Onboarding
    slide1Title: "Choose your meal!",
    slide1Sub: "Discover delicious meals from your favorite restaurant in just a few taps.",
    slide2Title: "Get it delivered fast!",
    slide2Sub: "Order with ease and enjoy exclusive deals on your first order.",
    slide3Title: "Track your order!",
    slide3Sub: "Follow your meal in real time, from the kitchen straight to your door.",
    skip: "Skip",
    next: "Next",
    getStarted: "Get Started",

    // Home
    hello: "Hello,",
    headline: "What would you\nlike to eat?",
    bannerTitle: "Our Best Sellers!",
    bannerSub: "Loved by thousands, now it's your turn!",
    orderNow: "Order now",
    categories: "Categories",
    seeMore: "See more",
    popularMeals: "Popular Meals",
    seeAll: "See all",
    allMeals: "All Meals",
    resultsFor: "Results for",
    noMealsFound: "No meals found",
    tryDifferentSearch: "Try a different search or browse categories",

    // Categories
    searchMenu: "Search menu...",
    allCategory: "All",
    noItemsFound: "No items found",
    tryDifferentCat: "Try selecting a different category",

    // Search bar
    searchMeals: "Search meals...",

    // Cart
    myCart: "My Cart",
    items: "items",
    item: "item",
    cartEmpty: "Your cart is empty",
    cartEmptySub: "Add some delicious meals to get started!",
    promoPlaceholder: "Promo code (WELCOME10)",
    applied: "Applied!",
    apply: "Apply",
    subtotal: "Subtotal",
    discount: "Discount (10%)",
    delivery: "Delivery",
    total: "Total",
    proceedCheckout: "Proceed to Checkout",

    // Meal detail
    loading: "Loading...",
    description: "Description",
    additionalOptions: "Additional Options",
    addCheese: "Add Cheese",
    extraSauce: "Extra Sauce",
    extraMeat: "Extra Meat",
    addToCart: "Add to Cart",

    // Checkout
    checkout: "Checkout",
    shippingAddress: "Shipping Address",
    fullName: "Full Name",
    phone: "Phone",
    address: "Address",
    notesOptional: "Notes (optional)",
    paymentMethod: "Payment Method",
    cashOnDelivery: "Cash on Delivery",
    creditCard: "Credit / Debit Card",
    orderSummary: "Order Summary",
    placingOrder: "Placing Order...",
    confirmation: "Confirmation",

    // Order success
    orderPlaced: "Order Placed",
    congratulations: "Congratulations!",
    orderConfirmed: "Your order has been confirmed successfully.\nWe'll deliver it to you shortly.",
    orderNum: "Order #",
    backToHome: "Back to Home",
    viewOrders: "View Orders",

    // Profile
    profile: "Profile",
    save: "Save",
    edit: "Edit",
    adminMode: "Admin Mode",
    manageMenu: "Manage Menu",
    orderHistory: "Order History",
    noOrders: "No orders yet.",
    language: "Language",

    // Admin
    manageMenuTitle: "Manage Menu",
    noMenuItems: "No menu items",
    addFirstItem: "Add your first item below",
    addItem: "Add Item",
    deleteItem: "Delete Item",
    deleteConfirm: "Are you sure you want to delete this menu item?",
    cancel: "Cancel",
    delete: "Delete",

    // Admin add/edit
    editItem: "Edit Item",
    photo: "Photo",
    itemNameLabel: "Item Name *",
    descriptionLabel: "Description",
    priceLabel: "Price *",
    prepTimeLabel: "Prep Time",
    categoryLabel: "Category *",
    markPopular: "Mark as Popular",
    saveChanges: "Save Changes",
    addToMenu: "Add to Menu",
    placeholderName: "e.g. Jumbo Burger",
    placeholderDesc: "Short description...",
    placeholderPrep: "20-30 min",

    // Admin inline
    available: "Available",
    unavailable: "Unavailable",
    addNewItem: "Add Item",
    adminBanner: "Admin Mode — tap any item to edit",
    popular: "Popular",
  },

  ru: {
    // Tab bar
    tabHome: "Главная",
    tabMenu: "Меню",
    tabCart: "Корзина",
    tabProfile: "Профиль",

    // Onboarding
    slide1Title: "Выбери блюдо!",
    slide1Sub: "Открой вкусные блюда из любимого ресторана всего за несколько касаний.",
    slide2Title: "Быстрая доставка!",
    slide2Sub: "Заказывай легко и пользуйся эксклюзивными скидками на первый заказ.",
    slide3Title: "Следи за заказом!",
    slide3Sub: "Следи за своим блюдом в реальном времени — от кухни прямо до твоей двери.",
    skip: "Пропустить",
    next: "Далее",
    getStarted: "Начать",

    // Home
    hello: "Привет,",
    headline: "Что ты хочешь\nсегодня съесть?",
    bannerTitle: "Наши хиты!",
    bannerSub: "Любимое тысячами — теперь твоя очередь!",
    orderNow: "Заказать",
    categories: "Категории",
    seeMore: "Ещё",
    popularMeals: "Популярные блюда",
    seeAll: "Все",
    allMeals: "Все блюда",
    resultsFor: "Результаты для",
    noMealsFound: "Блюда не найдены",
    tryDifferentSearch: "Попробуй другой запрос или выбери категорию",

    // Categories
    searchMenu: "Поиск в меню...",
    allCategory: "Все",
    noItemsFound: "Ничего не найдено",
    tryDifferentCat: "Попробуй выбрать другую категорию",

    // Search bar
    searchMeals: "Поиск блюд...",

    // Cart
    myCart: "Моя корзина",
    items: "товаров",
    item: "товар",
    cartEmpty: "Корзина пуста",
    cartEmptySub: "Добавь вкусные блюда, чтобы начать!",
    promoPlaceholder: "Промокод (WELCOME10)",
    applied: "Применён!",
    apply: "Применить",
    subtotal: "Подытог",
    discount: "Скидка (10%)",
    delivery: "Доставка",
    total: "Итого",
    proceedCheckout: "Оформить заказ",

    // Meal detail
    loading: "Загрузка...",
    description: "Описание",
    additionalOptions: "Дополнительные опции",
    addCheese: "Добавить сыр",
    extraSauce: "Дополнительный соус",
    extraMeat: "Дополнительное мясо",
    addToCart: "В корзину",

    // Checkout
    checkout: "Оформление",
    shippingAddress: "Адрес доставки",
    fullName: "Полное имя",
    phone: "Телефон",
    address: "Адрес",
    notesOptional: "Заметки (необязательно)",
    paymentMethod: "Способ оплаты",
    cashOnDelivery: "Наличными при доставке",
    creditCard: "Кредитная / дебетовая карта",
    orderSummary: "Сводка заказа",
    placingOrder: "Оформление...",
    confirmation: "Подтвердить",

    // Order success
    orderPlaced: "Заказ оформлен",
    congratulations: "Поздравляем!",
    orderConfirmed: "Ваш заказ успешно подтверждён.\nМы доставим его вам в ближайшее время.",
    orderNum: "Заказ №",
    backToHome: "На главную",
    viewOrders: "Мои заказы",

    // Profile
    profile: "Профиль",
    save: "Сохранить",
    edit: "Редактировать",
    adminMode: "Режим администратора",
    manageMenu: "Управление меню",
    orderHistory: "История заказов",
    noOrders: "Заказов пока нет.",
    language: "Язык",

    // Admin
    manageMenuTitle: "Управление меню",
    noMenuItems: "Нет позиций меню",
    addFirstItem: "Добавьте первую позицию ниже",
    addItem: "Добавить",
    deleteItem: "Удалить позицию",
    deleteConfirm: "Вы уверены, что хотите удалить эту позицию?",
    cancel: "Отмена",
    delete: "Удалить",

    // Admin add/edit
    editItem: "Редактировать",
    photo: "Фото",
    itemNameLabel: "Название *",
    descriptionLabel: "Описание",
    priceLabel: "Цена *",
    prepTimeLabel: "Время приготовления",
    categoryLabel: "Категория *",
    markPopular: "Отметить как популярное",
    saveChanges: "Сохранить",
    addToMenu: "Добавить в меню",
    placeholderName: "напр. Джамбо Бургер",
    placeholderDesc: "Краткое описание...",
    placeholderPrep: "20-30 мин",

    // Admin inline
    available: "Доступно",
    unavailable: "Недоступно",
    addNewItem: "Добавить",
    adminBanner: "Режим администратора — нажми на позицию для редактирования",
    popular: "Популярное",
  },
} as const;

export type TranslationKeys = keyof typeof translations.en;
export type Translations = typeof translations.en;

export function t(lang: Lang, key: TranslationKeys): string {
  return (translations[lang] as Translations)[key] ?? (translations.en as Translations)[key];
}

export default translations;
