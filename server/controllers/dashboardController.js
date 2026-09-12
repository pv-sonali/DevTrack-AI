import Application from '../models/Application.js';

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
export const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id; // mongoose ObjectId

    const stats = await Application.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const totalApplications = await Application.countDocuments({ userId });

    const formattedStats = {
      total: totalApplications,
      Applied: 0,
      Assessment: 0,
      Interview: 0,
      Offer: 0,
      Rejected: 0,
    };

    stats.forEach((stat) => {
      formattedStats[stat._id] = stat.count;
    });

    // Calculate rates
    const interviewRate = totalApplications > 0 ? ((formattedStats.Interview + formattedStats.Offer) / totalApplications) * 100 : 0;
    const offerRate = totalApplications > 0 ? (formattedStats.Offer / totalApplications) * 100 : 0;

    const recentApplications = await Application.find({ userId })
      .sort({ appliedDate: -1 })
      .limit(5);

    res.status(200).json({
      stats: formattedStats,
      rates: {
        interviewRate: interviewRate.toFixed(1),
        offerRate: offerRate.toFixed(1),
      },
      recentApplications,
    });
  } catch (error) {
    next(error);
  }
};
