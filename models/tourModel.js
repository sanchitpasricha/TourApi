const mongoose = require("mongoose");
const slugify = require("slugify");

const toursSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      trim: true,
      maxlength: [40, "A tour name must have less or equal to 40 char"],
      minlength: [10, "A tour must have minimum of 10 char"],
    },
    duration: {
      type: Number,
      required: [true, "A tour duration must have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a max group size"],
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Not an option",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Ratings average can not be less than 1.0"],
      max: [5, "Ratings average can not be greater than 5.0"],
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
    },
    slug: String,
    secretTour: Boolean,
    priceDiscount: Number,
    summary: {
      type: String,
      trim: true,
      required: [true, "A tour must have a summary"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a cover photo"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false, //To not send this field in response
    },
    startDates: [Date],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

toursSchema.virtual("durationWeeks").get(function() {
  return this.duration / 7;
});

//Document middleware: runs before .save and .create

toursSchema.pre("save", function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// toursSchema.pre("save", function(next) {
//   console.log("2nd pre middleware executing !");
//   next();
// });

// toursSchema.post("save", function(doc, next) {
//   console.log(doc);
//   next();
// });

//Query middleware

toursSchema.pre(/^find/, function(next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

//Aggregation middleware

toursSchema.pre("aggregate", function(next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model("Tour", toursSchema);

module.exports = Tour;
