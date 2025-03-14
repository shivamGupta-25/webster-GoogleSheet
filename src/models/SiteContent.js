import mongoose from 'mongoose';

// Define schemas for nested objects
const BannerSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  institution: String,
  description: String,
  buttonText: String,
  buttonLink: String,
  logoImage: String
}, { _id: false });

const ParagraphSchema = new mongoose.Schema({
  id: Number,
  content: String
}, { _id: false });

const AboutSchema = new mongoose.Schema({
  title: String,
  paragraphs: [ParagraphSchema]
}, { _id: false });

const CouncilMemberSchema = new mongoose.Schema({
  name: String,
  role: String,
  image: String,
  linkedin: String
}, { _id: false });

const CouncilSchema = new mongoose.Schema({
  title: String,
  description: String,
  members: [CouncilMemberSchema]
}, { _id: false });

const EventSchema = new mongoose.Schema({
  title: String,
  imageUrl: String
}, { _id: false });

const PastEventsSchema = new mongoose.Schema({
  title: String,
  description: String,
  events: [EventSchema]
}, { _id: false });

const WorkshopDetailSchema = new mongoose.Schema({
  label: String,
  value: String,
  id: String
}, { _id: false });

const WorkshopSocialMediaSchema = new mongoose.Schema({
  instagram: String,
  linkedin: String
}, { _id: false });

const WorkshopEmailNotificationSchema = new mongoose.Schema({
  subject: String
}, { _id: false });

const WorkshopSchema = new mongoose.Schema({
  title: String,
  shortDescription: String,
  isRegistrationOpen: Boolean,
  formSubmittedLink: String,
  details: [WorkshopDetailSchema],
  bannerImage: String,
  whatsappGroupLink: String,
  socialMedia: WorkshopSocialMediaSchema,
  emailNotification: WorkshopEmailNotificationSchema
}, { _id: false });

// Main SiteContent schema
const SiteContentSchema = new mongoose.Schema({
  banner: BannerSchema,
  about: AboutSchema,
  council: CouncilSchema,
  pastEvents: PastEventsSchema,
  workshop: WorkshopSchema
}, { timestamps: true });

// Create model if it doesn't exist already
export default mongoose.models.SiteContent || mongoose.model('SiteContent', SiteContentSchema); 