import Application from '../models/Application.js';

// @desc    Get applications
// @route   GET /api/applications
// @access  Private
export const getApplications = async (req, res, next) => {
  try {
    const { search, status, sort } = req.query;

    const query = { userId: req.user.id };

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { company: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } },
      ];
    }

    let queryBuilder = Application.find(query);

    if (sort === 'oldest') {
      queryBuilder = queryBuilder.sort({ appliedDate: 1 });
    } else {
      queryBuilder = queryBuilder.sort({ appliedDate: -1 }); // Newest default
    }

    const applications = await queryBuilder;

    res.status(200).json(applications);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single application
// @route   GET /api/applications/:id
// @access  Private
export const getApplication = async (req, res, next) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!application) {
      res.status(404);
      throw new Error('Application not found');
    }

    res.status(200).json(application);
  } catch (error) {
    next(error);
  }
};

// @desc    Create application
// @route   POST /api/applications
// @access  Private
export const createApplication = async (req, res, next) => {
  try {
    const { company, role, status, appliedDate, notes, jobLink } = req.body;

    if (!company || !role || !appliedDate) {
      res.status(400);
      throw new Error('Please add required fields');
    }

    const application = await Application.create({
      userId: req.user.id,
      company,
      role,
      status: status || 'Applied',
      appliedDate,
      notes,
      jobLink,
    });

    res.status(201).json(application);
  } catch (error) {
    next(error);
  }
};

// @desc    Update application
// @route   PUT /api/applications/:id
// @access  Private
export const updateApplication = async (req, res, next) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!application) {
      res.status(404);
      throw new Error('Application not found');
    }

    const updatedApplication = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedApplication);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete application
// @route   DELETE /api/applications/:id
// @access  Private
export const deleteApplication = async (req, res, next) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!application) {
      res.status(404);
      throw new Error('Application not found');
    }

    await application.deleteOne();

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    next(error);
  }
};
