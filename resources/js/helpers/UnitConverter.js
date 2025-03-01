// ตารางแปลงหน่วยพื้นฐานสำหรับการทำอาหาร
const conversionTable = {
    gram_to_teaspoon: 0.2, // 5 กรัม = 1 ช้อนชา
    gram_to_tablespoon: 0.0667, // 15 กรัม = 1 ช้อนโต๊ะ
    gram_to_cup: 0.00423, // 1 กรัม = 0.00423 ถ้วย
    ml_to_teaspoon: 0.2, // 5 มิลลิลิตร = 1 ช้อนชา
    ml_to_tablespoon: 0.0667, // 15 มิลลิลิตร = 1 ช้อนโต๊ะ
    ml_to_cup: 0.00422675, // 1 มิลลิลิตร = 0.00422675 ถ้วย
};

export const UnitConverter = {
    /**
     * แปลงจากกรัมเป็นช้อนชา
     */
    gramToTeaspoon(grams) {
        return grams * conversionTable.gram_to_teaspoon;
    },

    /**
     * แปลงจากกรัมเป็นช้อนโต๊ะ
     */
    gramToTablespoon(grams) {
        return grams * conversionTable.gram_to_tablespoon;
    },

    /**
     * แปลงจากกรัมเป็นถ้วย
     */
    gramToCup(grams) {
        return grams * conversionTable.gram_to_cup;
    },

    /**
     * แปลงจากมิลลิลิตรเป็นช้อนชา
     */
    mlToTeaspoon(ml) {
        return ml * conversionTable.ml_to_teaspoon;
    },

    /**
     * แปลงจากมิลลิลิตรเป็นช้อนโต๊ะ
     */
    mlToTablespoon(ml) {
        return ml * conversionTable.ml_to_tablespoon;
    },

    /**
     * แปลงจากมิลลิลิตรเป็นถ้วย
     */
    mlToCup(ml) {
        return ml * conversionTable.ml_to_cup;
    },

    /**
     * แปลงหน่วยแบบทั่วไป
     */
    convert(value, from, to) {
        const key = `${from}_to_${to}`;
        return conversionTable[key] ? value * conversionTable[key] : null;
    }
};
