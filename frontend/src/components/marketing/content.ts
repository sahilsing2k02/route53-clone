/**
 * Static copy + asset URLs for the public Route 53 marketing page
 * (mirrors https://aws.amazon.com/route53/).
 */

const IMG = "https://d1.awsstatic.com/onedam/marketing-channels/website/aws/en_US/product-categories";

export const LOGO_DARK = "https://a0.awsstatic.com/libra-css/images/logos/aws_logo_smile_179x109.png";
export const LOGO_WHITE = "https://a0.awsstatic.com/libra-css/images/logos/aws_smile-header-desktop-en-white_59x35.png";

export interface MegaMenu {
  heading: string;
  blurb: string;
  links: { label: string; description?: string }[];
  cta?: string;
}

export const NAV_ITEMS: { name: string; featured?: boolean; menu?: MegaMenu }[] = [
  { name: "re:Invent", featured: true },
  {
    name: "Discover AWS",
    menu: {
      heading: "Explore topics",
      blurb: "AWS is the world's most comprehensive cloud, enabling organizations to accelerate innovation, reduce costs, and scale more efficiently",
      links: [
        { label: "Why AWS" }, { label: "Getting Started" }, { label: "Security" }, { label: "Compliance" },
        { label: "Trust Center" }, { label: "Sustainability" }, { label: "Global Infrastructure" },
        { label: "News & announcements" }, { label: "AWS blog" },
      ],
    },
  },
  {
    name: "Products",
    menu: {
      heading: "Featured Products",
      blurb: "Get started with one of these featured services or browse all",
      cta: "Browse all products",
      links: [
        { label: "Amazon Route 53", description: "Scalable domain name system (DNS)" },
        { label: "Amazon Quick", description: "AI-powered assistant for work with research, business insights and automation" },
        { label: "Aurora", description: "Serverless relational database service for PostgreSQL, MySQL, and DSQL" },
        { label: "Amazon Bedrock", description: "The end-to-end platform for building generative AI applications and agents" },
        { label: "EC2", description: "Secure and resizable compute capacity for virtually any workload" },
        { label: "Lambda", description: "Service for running code without thinking about servers or clusters" },
      ],
    },
  },
  {
    name: "Solutions",
    menu: {
      heading: "Solutions",
      blurb: "Find the right AWS solution for your industry, use case and technology",
      links: [
        { label: "By use case" }, { label: "By industry" }, { label: "By organization type" },
        { label: "By solutions library" }, { label: "AWS Partner Network" }, { label: "AWS Marketplace" },
      ],
    },
  },
  {
    name: "Pricing",
    menu: {
      heading: "Pricing",
      blurb: "Pay only for what you use with AWS",
      links: [
        { label: "AWS Pricing Calculator" }, { label: "Free Tier" }, { label: "Savings Plans" },
        { label: "Cost optimization" },
      ],
    },
  },
  {
    name: "Resources",
    menu: {
      heading: "Resources",
      blurb: "Learn, build and connect with the AWS community",
      links: [
        { label: "Getting Started" }, { label: "Training" }, { label: "AWS Solutions Library" },
        { label: "Architecture Center" }, { label: "Product and Technical FAQs" }, { label: "Analyst Reports" },
        { label: "AWS Partners" },
      ],
    },
  },
];

export const SUBNAV_LINKS = [
  { label: "Overview", target: "overview" },
  { label: "Features", target: "get-started", dropdown: ["Features overview", "Traffic flow", "Domain registration", "Health checks", "Resolver"] },
  { label: "Pricing", target: "get-started" },
  { label: "Resources", target: "get-started" },
  { label: "FAQs", target: "feedback" },
];

export const BENEFITS = [
  {
    title: "Route end users to your site reliably with globally-dispersed Domain Name System (DNS) servers and automatic scaling.",
    body: "Amazon Route 53 ensures reliable and efficient routing of end users to your website by leveraging globally-dispersed Domain Name System (DNS) servers. With automatic scaling, the service dynamically adjusts to varying workloads, optimizing performance and maintaining a seamless user experience.",
  },
  {
    title: "Set up your DNS routing in minutes with domain name registration and straightforward visual traffic flow tools.",
    body: "Amazon Route 53 streamlines the setup of DNS routing by providing quick and easy domain name registration, complemented by straightforward visual traffic flow tools. This enables users to configure their DNS settings within minutes, simplifying the process of managing and directing web traffic efficiently.",
  },
  {
    title: "Customize your DNS routing policies to reduce latency, improve application availability, and maintain compliance.",
    body: "Amazon Route 53 allows users to tailor DNS routing policies to specific needs, such as reducing latency, enhancing application availability, and ensuring compliance. This customization empowers users to optimize their DNS configurations for performance, resilience, and adherence to regulatory requirements.",
  },
];

export const USE_CASES = [
  {
    title: "Manage network traffic globally",
    body: "Create, visualize, and scale complex routing relationships between records and policies with easy-to-use global DNS features.",
  },
  {
    title: "Build highly available applications",
    body: "Set routing policies to pre-determine and automate responses in case of failure, like redirecting traffic to alternative Availability Zones or Regions.",
  },
  {
    title: "Set up private DNS",
    body: "Assign and access custom domain names in your Amazon Virtual Private Cloud (VPC). Use internal AWS resources and servers without exposing DNS data to the public Internet.",
  },
];

export const CUSTOMERS = [
  {
    title: "Capital One improves cloud resilience with Amazon Route 53",
    href: "https://www.youtube.com/watch?v=YuHQAcNzAsE",
    alt: "A woman wearing a yellow jacket stands outside, smiling while using a pink smartphone near a metal railing and modern structure.",
    image: `${IMG}/compute/approved/images/0c804fef-fc5c-44e0-8adc-7beca4e42b0f.fcbf329e42b06f4c7642f3613b17e283e86a3192.jpeg`,
    logo: `${IMG}/networking/approved/images/e23e44ae-77a8-4cb4-a040-d24423d8e978.b43a568fef1b089e7b9e51a1ee56c348d448fad7.png`,
  },
  {
    title: "Netflix improved application resiliency with Amazon Route 53",
    href: "https://www.youtube.com/watch?v=WDDkLOT8SCk",
    alt: "Person choosing a movie on a streaming service.",
    image: `${IMG}/networking/approved/images/1cbdda4c-44ba-4965-8d48-b38d662c1639.d12e4e43dd51fc1b9a1a021ce3ad64c6ff975db8.jpeg`,
    logo: `${IMG}/storage/approved/images/4f866d92-c1bc-4247-ae09-93f3603a824f.43adc0acd137cae4316b44cf82e25695d86b58dd.png`,
  },
  {
    title: "McDonald's manages global traffic routing with Amazon Route 53",
    href: "https://www.youtube.com/watch?v=4FcUtjfkgB8&t=5s",
    alt: "McDonald's restaurant.",
    image: `${IMG}/networking/approved/images/84969449-e918-402b-b027-7c00ee5aed96.fce5cbdd6b5c2096e4d65d3e878725504d0c5e5e.jpeg`,
    logo: `${IMG}/networking/approved/images/cc62b0dc-6a26-4c24-9e5d-3db36e68dd2c.7e4b1ae505d0f0a014c70f8ae340289e7674ac59.png`,
  },
];

export const GET_STARTED = [
  {
    badge: "Features page",
    title: "Read more about Amazon Route 53",
    href: "https://aws.amazon.com/route53/features/",
    alt: "An abstract image featuring a blue mesh or grid pattern.",
    image: `${IMG}/application-integration/approved/images/826a956c-9a4e-47ce-89ca-dd52c2da63ad.256ecb785bfadda1650f128ff64074f6a29612fc.jpeg`,
  },
  {
    badge: "Getting started",
    title: "Secure your Amazon VPC DNS resolution with Amazon Route 53 Resolver DNS Firewall",
    href: "https://aws.amazon.com/blogs/networking-and-content-delivery/secure-your-amazon-vpc-dns-resolution-with-amazon-route-53-resolver-dns-firewall/",
    alt: "A dark blue background featuring a pattern of connected geometric cubes.",
    image: `${IMG}/networking/approved/images/0ecc02ef-9c29-4da9-8901-89866f339b2b.2baca620b97542288792a3dd389ce75441a68a0e.png`,
  },
  {
    badge: "Contact us",
    title: "Connect with an expert",
    href: "https://aws.amazon.com/contact-us/sales-support/",
    alt: "An abstract image featuring a 3D grid or mesh with red lighting.",
    image: `${IMG}/networking/approved/images/be6bb18c-e958-472e-be9e-f387d1b2ad33.1e6c556bee22484f3902064f2f29c9be25be065c.jpeg`,
  },
];

export const FOOTER_COLUMNS = [
  { heading: "Learn", links: ["What Is AWS?", "What Is Cloud Computing?", "What Is Agentic AI?", "Cloud Computing Concepts Hub", "AWS Cloud Security", "What's New", "Blogs", "Press Releases"] },
  { heading: "Resources", links: ["Getting Started", "Training", "AWS Trust Center", "AWS Solutions Library", "Architecture Center", "Product and Technical FAQs", "Analyst Reports", "AWS Partners"] },
  { heading: "Developers", links: ["Builder Center", "SDKs & Tools", ".NET on AWS", "Python on AWS", "Java on AWS", "PHP on AWS", "JavaScript on AWS"] },
  { heading: "Help", links: ["Contact Us", "File a Support Ticket", "AWS re:Post", "Knowledge Center", "AWS Support Overview", "AWS Accessibility", "Legal", "Event Code of Conduct", "Event Terms & Conditions"] },
];
