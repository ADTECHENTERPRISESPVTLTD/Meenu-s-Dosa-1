"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLocation = exports.updateLocation = exports.createLocation = exports.getLocation = exports.listLocations = void 0;
const location_1 = require("../models/location");
const errorhandler_1 = require("../middleware/errorhandler");
const apiresponse_1 = require("../utils/apiresponse");
const errors_1 = require("../utils/errors");
exports.listLocations = (0, errorhandler_1.asyncHandler)(async (req, res) => {
    const includeInactive = req.query.includeInactive === 'true';
    const filter = includeInactive ? {} : { isActive: true };
    const locations = await location_1.Location.find(filter).sort({ name: 1 });
    (0, apiresponse_1.sendSuccess)(res, locations);
});
exports.getLocation = (0, errorhandler_1.asyncHandler)(async (req, res) => {
    const location = await location_1.Location.findById(req.params.id);
    if (!location)
        throw new errors_1.NotFoundError('Location not found');
    (0, apiresponse_1.sendSuccess)(res, location);
});
exports.createLocation = (0, errorhandler_1.asyncHandler)(async (req, res) => {
    const location = await location_1.Location.create(req.body);
    (0, apiresponse_1.sendSuccess)(res, location, 'Location created', 201);
});
exports.updateLocation = (0, errorhandler_1.asyncHandler)(async (req, res) => {
    const location = await location_1.Location.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!location)
        throw new errors_1.NotFoundError('Location not found');
    (0, apiresponse_1.sendSuccess)(res, location, 'Location updated');
});
exports.deleteLocation = (0, errorhandler_1.asyncHandler)(async (req, res) => {
    const location = await location_1.Location.findByIdAndDelete(req.params.id);
    if (!location)
        throw new errors_1.NotFoundError('Location not found');
    (0, apiresponse_1.sendSuccess)(res, null, 'Location deleted');
});
