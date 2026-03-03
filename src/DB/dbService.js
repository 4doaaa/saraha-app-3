// ==================== findOne – Retrieve Single Document ====================

export const findOne = async({
    model , 
    filter = {} ,
     select = "" ,
      populate = [],
    } = {}) => {
return await model.findOne(filter).select(select).populate(populate);
    };


// ==================== find – Retrieve Multiple Documents ====================

export const find = async({
    model , 
    filter = {} ,
     select = "" ,
      populate = [],
    } = {}) => {
return await model.find(filter).select(select).populate(populate);
    };


// ==================== findById – Retrieve Document by _id ====================

export const findById = async({
    model , 
    id = "" ,
     select = "" ,
      populate = [],
    } = {}) => {
return await model.findById(id).select(select).populate(populate);    
};


// ==================== create – Insert One or Many Documents ====================

export const create = async({
    model , 
    data = [{}],
    options ={validateBeforeSave : true},
    } = {}) => {
return await model.create(data , options);
    };


// ==================== updateOne – Update First Matching Document ====================

export const updateOne = async({
    model , 
    filter = {},
    data = {},
    options ={runValidators : true},
    } = {}) => {
return await model.updateOne(filter, data , options);
    };


// ==================== findByIdAndUpdate – Find by _id & Update ====================

export const findByIdAndUpdate = async({
    model , 
    id = "",
    data = {},
    options ={new : true , runValidators: true},
    } = {}) => {
return await model.findByIdAndUpdate(id, data , options);
    };


// ==================== findOneAndUpdate – Find One & Update ====================

export const findOneAndUpdate = async({
    model , 
    filter = {},
    data = {},
    options ={new : true , runValidators: true},
    } = {}) => {
return await model.findOneAndUpdate(filter, data , options);
    };