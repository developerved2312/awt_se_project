import Query from '../models/Query.js';

/**
 * @desc    Create a new Farmer Query / Agronomist Consultation
 * @route   POST /api/queries
 * @access  Private (Farmer)
 */
export const createQuery = async (req, res) => {
  try {
    const {
      title,
      titleGu,
      description,
      descriptionGu,
      crop,
      cropGu,
      urgency,
      imageUrl,
      scanId,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        error: 'Title and description are required',
      });
    }

    const query = await Query.create({
      title,
      titleGu: titleGu || title,
      description,
      descriptionGu: descriptionGu || description,
      crop: crop || 'Cotton',
      cropGu: cropGu || 'કપાસ',
      urgency: urgency || 'Medium',
      status: 'Pending Review',
      farmerId: req.user._id,
      farmerName: req.user.name,
      farmerNameGu: req.user.nameGu || req.user.name,
      farmerPhone: req.user.phone || '',
      village: req.user.village || '',
      taluka: req.user.taluka || '',
      district: req.user.district || 'Vadodara',
      imageUrl: imageUrl || '',
      scanId: scanId || null,
    });

    return res.status(201).json({
      success: true,
      message: 'Query posted successfully to District Agronomist Desk',
      query,
    });
  } catch (error) {
    console.error('⚠️ [Create Query Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Error creating farmer consultation query',
    });
  }
};

/**
 * @desc    Get Queries (Farmer sees own queries; Officer sees all district queries)
 * @route   GET /api/queries
 * @access  Private
 */
export const getQueries = async (req, res) => {
  try {
    const { status, crop, urgency, all } = req.query;
    const filter = {};

    // Officers, Admins, or Overview mode can view all district queries
    if (!req.user || req.user.role === 'officer' || req.user.role === 'admin' || all === 'true') {
      if (status) filter.status = status;
      if (crop) filter.crop = crop;
      if (urgency) filter.urgency = urgency;
    } else if (req.user) {
      // Farmer only views their own queries
      filter.farmerId = req.user._id;
      if (status) filter.status = status;
    }

    const queries = await Query.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: queries.length,
      queries,
    });
  } catch (error) {
    console.error('⚠️ [Get Queries Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Error retrieving queries',
    });
  }
};

/**
 * @desc    Get a single query by ID
 * @route   GET /api/queries/:id
 * @access  Private
 */
export const getQueryById = async (req, res) => {
  try {
    const query = await Query.findById(req.params.id);
    if (!query) {
      return res.status(404).json({
        success: false,
        error: 'Query not found',
      });
    }

    return res.status(200).json({
      success: true,
      query,
    });
  } catch (error) {
    console.error('⚠️ [Get Query By ID Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Error retrieving query record',
    });
  }
};

/**
 * @desc    Agricultural Officer Responds to Query
 * @route   PUT /api/queries/:id/respond
 * @access  Private (Officer only)
 */
export const respondToQuery = async (req, res) => {
  try {
    const query = await Query.findById(req.params.id);
    if (!query) {
      return res.status(404).json({
        success: false,
        error: 'Query not found',
      });
    }

    const {
      comment,
      commentGu,
      prescribedRemedies,
      prescribedRemediesGu,
      status,
    } = req.body;

    if (!comment) {
      return res.status(400).json({
        success: false,
        error: 'Official recommendation remarks are required',
      });
    }

    query.officerResponse = {
      officerId: req.user._id,
      officerName: req.user.name,
      officerBadge: req.user.badgeNumber || 'GJ-AGRI-OFFICER',
      designation: req.user.designation || 'District Agricultural Officer',
      comment,
      commentGu: commentGu || comment,
      prescribedRemedies: Array.isArray(prescribedRemedies) ? prescribedRemedies : [],
      prescribedRemediesGu: Array.isArray(prescribedRemediesGu) ? prescribedRemediesGu : [],
      respondedAt: new Date(),
    };

    query.status = status || 'Reviewed';

    const updatedQuery = await query.save();

    return res.status(200).json({
      success: true,
      message: 'Official response & advisory recorded successfully',
      query: updatedQuery,
    });
  } catch (error) {
    console.error('⚠️ [Respond Query Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Error submitting official response',
    });
  }
};

/**
 * @desc    Delete farmer query
 * @route   DELETE /api/queries/:id
 * @access  Private
 */
export const deleteQuery = async (req, res) => {
  try {
    const query = await Query.findById(req.params.id);
    if (!query) {
      return res.status(404).json({
        success: false,
        error: 'Query not found',
      });
    }

    // Check ownership: only the farmer or officer can delete
    if (
      req.user.role !== 'officer' &&
      query.farmerId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this query',
      });
    }

    await Query.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Query removed successfully',
    });
  } catch (error) {
    console.error('⚠️ [Delete Query Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Error deleting query',
    });
  }
};
