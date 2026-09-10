"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLocation = exports.updateLocation = exports.createLocation = exports.getLocation = exports.listLocations = void 0;
const Location_1 = require("../models/Location");
const errorHandler_1 = require("../middleware/errorHandler");
const apiResponse_1 = require("../utils/apiResponse");
const errors_1 = require("../utils/errors");
exports.listLocations = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const includeInactive = req.query.includeInactive === 'true';
    const filter = includeInactive ? {} : { isActive: true };
    const locations = await Location_1.Location.find(filter).sort({ name: 1 });
    (0, apiResponse_1.sendSuccess)(res, locations);
});
exports.getLocation = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const location = await Location_1.Location.findById(req.params.id);
    if (!location)
        throw new errors_1.NotFoundError('Location not found');
    (0, apiResponse_1.sendSuccess)(res, location);
});
exports.createLocation = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const location = await Location_1.Location.create(req.body);
    (0, apiResponse_1.sendSuccess)(res, location, 'Location created', 201);
});
exports.updateLocation = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const location = await Location_1.Location.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!location)
        throw new errors_1.NotFoundError('Location not found');
    (0, apiResponse_1.sendSuccess)(res, location, 'Location updated');
});
exports.deleteLocation = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const location = await Location_1.Location.findByIdAndDelete(req.params.id);
    if (!location)
        throw new errors_1.NotFoundError('Location not found');
    (0, apiResponse_1.sendSuccess)(res, null, 'Location deleted');
});
