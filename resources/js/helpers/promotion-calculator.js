// Types of discounts
const DISCOUNT_TYPES = {
    FIXED: "FIXED",
    PERCENTAGE: "PERCENTAGE",
    BUY_X_GET_Y: "BUY_X_GET_Y",
    CATEGORY_DISCOUNT: "CATEGORY_DISCOUNT",
};

/**
 * Calculate subtotal for given items
 * @param {Array} items - Array of cart items
 * @param {Function} filterFn - Optional filter function
 * @returns {number} - Subtotal amount
 */
const calculateSubtotal = (items, filterFn = null) => {
    const itemsToCalculate = filterFn ? items.filter(filterFn) : items;
    return itemsToCalculate.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
};

/**
 * Calculate fixed amount discount
 * @param {number} fixedAmount - Fixed discount amount
 * @returns {number} - Calculated discount
 */
export const calculateFixedDiscount = (_, fixedAmount) => {
    return Number(fixedAmount);
};

/**
 * Calculate percentage-based discount
 * @param {Array} items - Cart items
 * @param {number} percentage - Discount percentage
 * @returns {number} - Calculated discount
 */
export const calculatePercentageDiscount = (items, percentage) => {
    const subtotal = calculateSubtotal(items);
    return (subtotal * Number(percentage)) / 100;
};

/**
 * Calculate buy X get Y discount
 * @param {Array} items - Cart items
 * @param {number} buyQty - Number of items to buy
 * @param {number} freeQty - Number of free items
 * @returns {number} - Calculated discount
 */
export const calculateBuyXGetYDiscount = (items, buyQty, freeQty) => {
    // Group items by product ID with their total quantities
    const groupedItems = items.reduce(
        (groups, item) => ({
            ...groups,
            [item.id]: {
                ...item,
                quantity: (groups[item.id]?.quantity || 0) + item.quantity,
            },
        }),
        {}
    );

    // Calculate discount for each product group
    return Object.values(groupedItems).reduce((totalDiscount, item) => {
        const setSize = Number(buyQty) + Number(freeQty);
        const numSets = Math.floor(item.quantity / setSize);
        const freeItems = numSets * Number(freeQty);
        return totalDiscount + freeItems * item.price;
    }, 0);
};

/**
 * Calculate category-specific discount
 * @param {Array} items - Cart items
 * @param {Object} params - Category discount parameters
 * @returns {number} - Calculated discount
 */
export const calculateCategoryDiscount = (
    items,
    { categoryId, discountType, discountValue }
) => {
    const isCategoryItem = (item) => item.category_id === Number(categoryId);
    const categoryItems = items.filter(isCategoryItem);

    if (categoryItems.length === 0) return 0;

    const discountCalculators = {
        [DISCOUNT_TYPES.FIXED]: () => Number(discountValue),
        [DISCOUNT_TYPES.PERCENTAGE]: () => {
            const categorySubtotal = calculateSubtotal(categoryItems);
            return (categorySubtotal * Number(discountValue)) / 100;
        },
    };

    return discountCalculators[discountType]?.() || 0;
};

/**
 * Check if promotion is currently active
 * @param {Object} promotion - Promotion object
 * @param {Date} currentTime - Current time
 * @returns {boolean} - Whether promotion is active
 */
const isPromotionActive = (promotion, currentTime) => {
    if (!promotion.is_active) return false;

    const now = new Date(currentTime);
    const startDate = new Date(promotion.start_date);
    const endDate = new Date(promotion.end_date);

    return now >= startDate && now <= endDate;
};

/**
 * Calculate discount for a specific promotion
 * @param {Array} items - Cart items
 * @param {Object} promotion - Promotion object
 * @returns {number} - Calculated discount
 */
const calculatePromotionDiscount = (items, promotion) => {
    const discountCalculators = {
        [DISCOUNT_TYPES.FIXED]: () =>
            calculateFixedDiscount(items, promotion.fixed),

        [DISCOUNT_TYPES.PERCENTAGE]: () =>
            calculatePercentageDiscount(items, promotion.percentage),

        [DISCOUNT_TYPES.BUY_X_GET_Y]: () =>
            promotion.buy_x_get_y
                ? calculateBuyXGetYDiscount(
                      items,
                      promotion.buy_x_get_y.buy,
                      promotion.buy_x_get_y.get
                  )
                : 0,

        [DISCOUNT_TYPES.CATEGORY_DISCOUNT]: () =>
            promotion.category
                ? calculateCategoryDiscount(items, {
                      categoryId: promotion.category.category_id,
                      discountType: promotion.category.discount_type,
                      discountValue: promotion.category.discount_value,
                  })
                : 0,
    };

    return discountCalculators[promotion.type]?.() || 0;
};

/**
 * Calculate total discount from all applicable promotions
 * @param {Array} items - Cart items
 * @param {Array} promotions - Available promotions
 * @param {Date} currentTime - Current time
 * @returns {number} - Maximum applicable discount
 */
export const calculateTotalDiscount = (items, promotions, currentTime) => {
    return promotions
        .filter((promotion) => isPromotionActive(promotion, currentTime))
        .reduce((maxDiscount, promotion) => {
            const currentDiscount = calculatePromotionDiscount(
                items,
                promotion
            );
            console.log(
                `Promotion: ${promotion.name}, Discount: ${currentDiscount}`
            );
            return Math.max(maxDiscount, currentDiscount);
        }, 0);
};
