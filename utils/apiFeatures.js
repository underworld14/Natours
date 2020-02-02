class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filtering() {
    const queryObj = { ...this.queryStr };
    const exclude = ['page', 'limit', 'sort', 'fields'];
    exclude.forEach(el => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    if (this.queryStr.search) {
      const seacrhVal = {
        name: { $regex: new RegExp(this.queryStr.search, 'i') }
      };
      this.query = this.query.find(seacrhVal);
    } else {
      this.query = this.query.find(JSON.parse(queryStr));
    }

    return this;
  }

  sorting() {
    if (this.queryStr.sort) {
      const sortQuery = this.queryStr.sort.split(',').join(' ');
      this.query = this.query.sort(sortQuery);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    if (this.queryStr.fields) {
      const selectQuery = this.queryStr.fields.split(',').join(' ');
      this.query = this.query.select(selectQuery);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    const page = Number(this.queryStr.page) || 1;
    const limit = Number(this.queryStr.limit) || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = ApiFeatures;
