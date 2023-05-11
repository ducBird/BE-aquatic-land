import moment from "moment";

export const convertDateMiddleware = (req, res, next) => {
  const { body } = req;
  const { birthDay, dateOfManufacture, exprirationDate } = body;

  if (birthDay) {
    const formattedDate = moment(birthDay, "DD-MM-YYYY").toISOString();
    req.body.birthDay = formattedDate;
  }

  if (dateOfManufacture) {
    const formattedDate = moment(dateOfManufacture, "DD-MM-YYYY").toISOString();
    req.body.dateOfManufacture = formattedDate;
  }

  if (exprirationDate) {
    const formattedDate = moment(exprirationDate, "DD-MM-YYYY").toISOString();
    req.body.exprirationDate = formattedDate;
  }

  next();
};
