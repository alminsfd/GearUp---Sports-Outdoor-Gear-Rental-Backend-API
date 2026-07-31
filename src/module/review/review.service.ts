
import { OrderStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ICreateReviewPayload, IUpdateReviewPayload } from "./review.interface";

// 1. Create Review (Only if Customer returned the gear)
const createReviewInDb = async (
     payload: ICreateReviewPayload,
     customerId: string
) => {
     const { gearItemId, rating, comment } = payload;

     //  1. Rating must be between 1 and 5
     if (rating < 1 || rating > 5) {
          throw new Error("Rating must be between 1 and 5!");
     }

     // 2. Check if the customer has completed the RETURNED rental of this gear.
     const completedOrder = await prisma.rentalOrder.findFirst({
          where: {
               customerId,
               gearItemId,
               status: OrderStatus.RETURNED,
          },
     });

     if (!completedOrder) {
          throw new Error(
               "You can only leave a review after successfully renting and returning this gear!"
          );
     }

     //  3. Check if the user has already given a review (Duplicate Prevention)
     const existingReview = await prisma.review.findFirst({
          where: {
               customerId,
               gearItemId,
          },
     });

     if (existingReview) {
          throw new Error("You have already reviewed this gear item!");
     }

     // 4. Creating a review
     const result = await prisma.review.create({
          data: {
               rating,
               comment,
               customerId,
               gearItemId,
          },
          include: {
               customer: {
                    select: {
                         id: true,
                         name: true,
                         profileImage: true,
                    },
               },
               gearItem: {
                    select: {
                         id: true,
                         title: true,
                    },
               },
          },
     });

     return result;
};

// 2. Get All Reviews for a Specific Gear (Public)
const getGearReviewsFromDb = async (gearItemId: string) => {
     const reviews = await prisma.review.findMany({
          where: { gearItemId },
          include: {
               customer: {
                    select: {
                         id: true,
                         name: true,
                         profileImage: true,
                    },
               },
          },
          orderBy: { createdAt: "desc" },
     });

     // Calculating average rating and total number of reviews (Aggregations)
     const aggregate = await prisma.review.aggregate({
          where: { gearItemId },
          _avg: { rating: true },
          _count: { rating: true },
     });

     return {
          averageRating: aggregate._avg.rating ? Number(aggregate._avg.rating.toFixed(1)) : 0,
          totalReviews: aggregate._count.rating,
          reviews,
     };
};

// 3. Update Review (Customer can edit own review)
const updateReviewInDb = async (
     reviewId: string,
     payload: IUpdateReviewPayload,
     customerId: string
) => {
     const existingReview = await prisma.review.findUnique({
          where: { id: reviewId },
     });

     if (!existingReview) {
          throw new Error("Review not found!");
     }

     if (existingReview.customerId !== customerId) {
          throw new Error("Unauthorized! You can only update your own review.");
     }

     if (payload.rating && (payload.rating < 1 || payload.rating > 5)) {
          throw new Error("Rating must be between 1 and 5!");
     }

     const result = await prisma.review.update({
          where: { id: reviewId },
          data: payload,
     });

     return result;
};

// 4. Delete Review (Customer can delete own review, Admin can delete any)
const deleteReviewFromDb = async (
     reviewId: string,
     userId: string,
     role: string
) => {
     const existingReview = await prisma.review.findUnique({
          where: { id: reviewId },
     });

     if (!existingReview) {
          throw new Error("Review not found!");
     }

     if (role !== "ADMIN" && existingReview.customerId !== userId) {
          throw new Error("Unauthorized! You can only delete your own review.");
     }

     const result = await prisma.review.delete({
          where: { id: reviewId },
     });

     return result;
};

export const reviewService = {
     createReviewInDb,
     getGearReviewsFromDb,
     updateReviewInDb,
     deleteReviewFromDb,
};