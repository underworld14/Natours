const fs = require("fs");

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkId = (req, res, next, val) => {
  if (req.params.id * 1 > tours.length - 1) {
    return res.status(404).json({
      status: "fail",
      time: req.reqTime,
      message: "Invalid ID"
    });
  }
  next();
};

exports.bodyCheck = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: "error",
      message: "Please insert name and price"
    });
  }
  next();
};

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    time: req.reqTime,
    results: tours.length,
    data: tours
  });
};

exports.postTours = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newData = Object.assign({ id: newId }, req.body);
  tours.push(newData);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    () => {
      res.status(201).json({
        status: "success",
        time: req.reqTime,
        data: newData
      });
    }
  );
};

exports.getTourById = (req, res) => {
  const id = req.params.id;
  const tour = tours.find(data => data.id == id);

  res.status(200).json({
    status: "success",
    time: req.reqTime,
    data: tour
  });
};

exports.deleteTour = (req, res) => {
  res.status(500).json({
    status: "error",
    time: req.reqTime,
    message: "route not available"
  });
};
