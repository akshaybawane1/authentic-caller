const asyncHandler = require("express-async-handler");
const CreateError = require("../Helpers/CreateError");
const { Sequelize } = require("sequelize");
const GlobalContact = require("../Models/GlobalContact");
require("dotenv").config();

/**
 * Import contact of existing user
 * @param contactcsv
 * Assuming contacts will be uploaded as csv file
 */
const UploadContacts = asyncHandler(async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileBuffer = req.file.buffer.toString("utf8");
    const contactsToInsert = [];

    // Parse the CSV data
    const rows = fileBuffer.split("\n");
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i].trim();
      if (i === 0) {
        continue;
      }
      const [name, phone, email] = row.split(",");

      if (name && phone) {
        const contact = {
          personal_contact_of_id: req.user.dataValues.id, //Personal contact of user uploading this contacts
          name,
          phone: Number(phone),
        };
        if (email) {
          contact["email"] = email;
        }
        contactsToInsert.push(contact);
      }
    }

    const globalcontacts = await GlobalContact.bulkCreate(contactsToInsert);
    res.send({ status: true, data: globalcontacts });
  } catch (error) {
    console.log(error);
    return next(error);
  }
});

/**
 * Report spam for both registered and non registered users
 * @param userId
 * Increase the spam count when reported
 */
const ReportSpam = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.body.userId;
    if (!userId) {
      return next(new CreateError("User Id is required", 404));
    }

    const user = await GlobalContact.findByPk(userId);

    if (user) {
      await user.increment("spamCount");
    } else {
      return next(new CreateError("User does not exists.", 404));
    }

    res.send({ status: true, message: "User reported successfully." });
  } catch (error) {
    return next(error);
  }
});

/**
 * Search user globally
 * @param searchStr
 * Either search by phone or name
 * Sort search result such that those with name starting with search string will come first after that those with matching string will come
 * For matching phone number if registered user is found that will be sent in response otherwise all matching phone will be sent
 */
const Search = asyncHandler(async (req, res, next) => {
  try {
    const searchStr = req.params.searchStr;
    if (!searchStr) {
      return next(new CreateError("Search string is required", 404));
    }

    //If search string is a number
    if (!isNaN(Number(searchStr))) {
      //check for registered user
      const registered_user = await GlobalContact.findOne({
        where: {
          phone: {
            [Sequelize.Op.eq]: Number(searchStr),
          },
          isRegistered: true,
        },
        attributes: ["id", "name", "phone", "spamCount"],
      });

      if (registered_user) {
        return res.send({ status: true, data: [registered_user] });
      } else {
        //Check for contacts with matching phone
        const user = await GlobalContact.findOne({
          where: {
            phone: {
              [Sequelize.Op.eq]: Number(searchStr),
            },
          },
          attributes: ["id", "name", "phone", "spamCount"],
        });

        if (user) {
          return res.send({ status: true, data: user });
        }
      }
    }

    //if search string is not number search for matching name
    const results = await GlobalContact.findAll({
      where: {
        name: {
          [Sequelize.Op.like]: `%${searchStr}%`,
        },
        id: {
          [Sequelize.Op.not]: req.user.dataValues.id, // Exclude the current user's ID
        },
      },
      attributes: ["id", "name", "phone", "spamCount"],
    });

    // Sort the results based on whether the name starts with the search string
    const sortedResults = results.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();

      // Check if the name starts with the search string
      const startsWithSearchStringA = nameA.startsWith(searchStr.toLowerCase());
      const startsWithSearchStringB = nameB.startsWith(searchStr.toLowerCase());

      // If both start with the search string, sort based on the entire name
      if (startsWithSearchStringA && startsWithSearchStringB) {
        return nameA.localeCompare(nameB);
      }

      // Sort based on whether the name starts with the search string
      return startsWithSearchStringA ? -1 : startsWithSearchStringB ? 1 : 0;
    });

    return res.send({ status: true, data: sortedResults });
  } catch (error) {
    return next(error);
  }
});

/**
 * Get contact details after clicking on any search result
 * @param id
 * If user is registered and is in contact list of current user email will be visible otherwise email will be hidden
 */
const GetUserById = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return next(new CreateError("User Id is required", 404));
    }

    let user = await GlobalContact.findByPk(userId);
    user = user.dataValues;
    if (user) {
      const isPersonalContact = await GlobalContact.findOne({
        where: {
          personal_contact_of_id: req.user.dataValues.id,
          phone: user.phone,
        },
      });
      //Allow email if user is registered and is in current user's contact
      if (user.isRegistered && isPersonalContact) {
        delete user["password"];
        return res.send({ status: true, data: user });
      } else {
        //Restrict email if user is not registered or not in current user's contact
        delete user["password"];
        delete user["email"];
        return res.send({ status: true, data: user });
      }
    } else {
      return next(new CreateError("User does not exists.", 404));
    }
  } catch (error) {
    return next(error);
  }
});

module.exports = { UploadContacts, ReportSpam, Search, GetUserById };
