const createItem = async (req = {}, model = {}) => {
    try {
        const item = await model.create(req);
        return item;
    } catch (err) {
        throw new Error(err.message);
    }
};

const findItem = async (query = {}, model = {}) => {
    try {
        const item = await model.findOne(query);
        return item;
    } catch (err) {
        throw new Error(err.message);
    }
};

const findAllItems = async (query = {}, model = {}, offset = 0, limit = 0) => {
    try {
        const item = await model.find(query).skip(offset).limit(limit);
        return item;
    } catch (err) {
        throw new Error(err.message);
    }
};

const findAllItemsDesc = async (query = {}, model = {}, offset = 0, limit = 0) => {
    try {
        const item = await model.find(query).sort({ createdAt: -1 }).skip(offset).limit(limit);
        return item;
    } catch (err) {
        throw new Error(err.message);
    }
};

const countAllItems = async (query = {}, model = {}) => {
    try {
        const itemCount = await model.find(query).countDocuments();
        return itemCount;
    } catch (err) {
        throw new Error(err.message);
    }
};

const deleteItem = async (query = {}, model = {}) => {
    try {
        const deletedItems = await model.deleteMany(query);
        return deletedItems;
    } catch (err) {
        throw new Error(err.message);
    }
};

const updateItem = async (query = {}, updateData = {}, model = {}) => {
    try {
        const updatedItem = await model.findOneAndUpdate(query, updateData, {
            new: true,
            runValidators: true,
        });
        return updatedItem;
    } catch (err) {
        throw new Error(err.message);
    }
};

const updateManyItems = async (query = {}, updateData = {}, model = {}) => {
    try {
        const updatedItems = await model.updateMany(query, { $set: updateData });
        return updatedItems;
    } catch (err) {
        throw new Error(err.message);
    }
};

// exporting the db methods :-
module.exports = {
    createItem,
    findItem,
    findAllItems,
    countAllItems,
    deleteItem,
    updateItem,
    findAllItemsDesc,
    updateManyItems,
};