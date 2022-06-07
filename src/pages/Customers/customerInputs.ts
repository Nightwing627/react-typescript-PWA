export const vehicleInputs = [
  {
    label: "Vehicle No.",
    model: ".vehicleNumber",
    type: "text",
    required: true,
  },
  {
    label: "Fuel Type",
    model: ".fuelType",
    type: "select",
    options: [
      {label: "Petrol", value: "Petrol"},
      {label: "Diesel", value: "Diesel"},
      {label: "CNG", value: "CNG"},
    ]
  },
  {
    label: "3 or 4 Wheeler",
    model: ".wheeles",
    type: "select",
    options: [
      {label: "3 Wheeler", value: "3 Wheeler"},
      {label: "4 Wheeler", value: "4 Wheeler"},
    ],
    required: true,
  },
  {
    label: "Vehicle Make",
    model: ".vehicleMek",
    type: "select",
    options: [
      {label: "Honda", value: "Honda"},
      {label: "Hyundai", value: "Hyundai"},
      {label: "Maruti Suzuki", value: "Maruti Suzuki"},
      {label: "Tata", value: "Tata"},
      {label: "Bajaj Auto Limited", value: "Bajaj Auto Limite"},
      {label: "Mahindra & Mahindra Ltd.", value: "Mahindra & Mahindra Ltd."},
    ]
  },
  {
    label: "Vehicle Model",
    model: ".vehicleModel",
    type: "select",
    options: [
      {label: "Tata Altroz", value: "Tata Altroz"},
      {label: "Tata EVision", value: "Tata EVision"},
      {label: "Tata Gravitas", value: "Tata Gravitas"},
      {label: "Tata Harrier", value: "Tata Harrier"},
      {label: "Tata Hexa", value: "Tata Hexa"},
      {label: "Tata Hornbill", value: "Tata Hornbill"},
      {label: "Tata Nexon", value: "Tata Nexon"},
      {label: "Tata Tiago", value: "Tata Tiago"},
      {label: "Tata Tigor", value: "Tata Tigor"},
      {label: "Accord", value: "Accord"},
      {label: "Acty", value: "Diesel"},
      {label: "Amaze", value: "Amaze"},
      {label: "Avancier", value: "Avancier"},
      {label: "Ballade", value: "Ballade"},
      {label: "Brio", value: "Brio"},
      {label: "BR-V", value: "BR-V"},
      {label: "City", value: "City"},
      {label: "City Gienia", value: "City Gienia"},
      {label: "City Grace", value: "City Grace"},
      {label: "City Greiz", value: "City Greiz"},
      {label: "Hyundai Tucson", value: "Hyundai Tucson"},
      {label: "Hyundai Grand i10 Nios", value: "Hyundai Grand i10 Nios"},
      {label: "Hyundai Kona Electric", value: "Hyundai Kona Electric"},
      {label: "Hyundai Elantra", value: "Hyundai Elantra"},
      {label: "Maruti Suzuki Dzire Facelift", value: "Maruti Suzuki Dzire Facelift"},
      {label: "Maruti Suzuki Vitara Brezza", value: "Maruti Suzuki Vitara Brezza"},
      {label: "Maruti Suzuki Baleno", value: "Maruti Suzuki Baleno"},
      {label: "Maruti Suzuki Swift", value: "Maruti Suzuki Swift"},
      {label: "Maruti Suzuki Ertiga", value: "Maruti Suzuki Ertiga"},
      {label: "Bajaj RE Auto Rickshaw Compact 4S", value: "Bajaj RE Auto Rickshaw Compact 4S"},
      {label: "Bajaj RE Compact Diesel Auto Rickshaw", value: "Bajaj RE Compact Diesel Auto Rickshaw"},
      {label: "Bajaj RE Compact LPG Auto Rickshaw", value: "Bajaj RE Compact LPG Auto Rickshaw"},
      {label: "MAHINDRA ALFA DX", value: "MAHINDRA ALFA DX"},
      {label: "MAHINDRA ALFA Champ", value: "MAHINDRA ALFA Champ"},
      {label: "MAHINDRA ALFA Comfy", value: "MAHINDRA ALFA Comfy"}, 
    ]
  },
  {
    label: "Usage of Vehicle",
    model: ".usage",
    type: "select",
    options: [
      {label: "Commercial", value: "Commercial"},
      {label: "Private", value: "Private"},
    ]
  },
  {
    label: "Engine Type",
    model: ".vehicleType",
    type: "select",
    options: [
      {label: "2 Stroke", value: "2 Stroke"},
      {label: "4 Stroke", value: "4 Stroke"},
    ]
  },
  {
    label: "Daily Running KMS",
    model: ".dailyRunning",
    type: "number",
  },
  {
    label: "Registration Year",
    model: ".registration",
    type: "date",
  },
  {
    label: "Year Of Manufacturing",
    model: ".mfg",
    type: "select",
    options: [
      {label: "2010", value: 2010},
      {label: "2011", value: 2011},
      {label: "2012", value: 2012},
      {label: "2013", value: 2013},
      {label: "2014", value: 2014},
      {label: "2015", value: 2015},
      {label: "2016", value: 2016},
      {label: "2017", value: 2017},
      {label: "2018", value: 2018},
      {label: "2019", value: 2019},
      {label: "2020", value: 2020},
    ]
  },
  {
    label: "Chassis Number",
    model: ".chassis",
    type: "text",
    required: true,
  },
];

export const options = [
  {
    label: "First Name",
    model: ".firstName",
    type: "text",
    required: true,
  },
  {
    label: "Middle Name",
    model: ".middleName",
    type: "text",
  },
  {
    label: "Last Name",
    model: ".lastName",
    type: "text",
    required: true,
  },
  {
    label: "Company",
    model: ".company",
    type: "text",
    required: true,
  },
  {
    label: "Email",
    model: ".email",
    type: "text",
    required: true,
  },
  {
    label: "WhatsApp Number",
    model: ".whatsAppNumber",
    type: "number",
    required: true,
  },
];

export const streetInputs = [
  {
    label: "Street",
    model: ".street",
    type: "text",
  },
  {
    label: "City",
    model: ".city",
    type: "text",
  },
  {
    label: "State/Provinance",
    model: ".state",
    type: "text",
  },
  {
    label: "Zip/Postal Code",
    model: ".zip",
    type: "text",
  },
  {
    label: "Country",
    model: ".country",
    type: "text",
  },
];

export const leadDealer = [
  {
    label: "First Name",
    model: ".firstName",
    type: "text",
    required: true,
  },
  {
    label: "Middle Name",
    model: ".middleName",
    type: "text",
  },
  {
    label: "Last Name",
    model: ".lastName",
    type: "text",
    required: true,
  },
  {
    label: "Company",
    model: ".company",
    required: true,
    type: "text",
    required: true,
  },
  {
    label: "Email",
    model: ".email",
    type: "text",
    required: true,
  },
  {
    label: "WhatsApp Number",
    model: ".whatsAppNumber",
    type: "text",
    required: true,
  },
  {
    label: "Lead Type",
    model: ".leadType",
    type: "select",
    options: [
      {label: "B2B", value: "B2B"},
      {label: "B2C", value: "B2C"},
      {label: "B2G", value: "B2G"}
    ]
  },
  {
    label: "Sub Lead Type",
    model: ".subleadType",
    type: "select",
    options: [
      {label: "Customer", value: "Customer"},
      {label: "Influencer", value: "Influencer"},
      {label: "Fitment", value: "Fitment"},
      {label: "Servicing", value: "Servicing"}
    ]
  },
  {
    label: "Lead Source",
    model: ".leadSource",
    type: "select",
    options: [
      // {label: "Partner", value: "Partner"},
      // {label: "Website", value: "Website"},
      // {label: "Advertisement", value: "Advertisement"},
      // {label: "Webinar", value: "Webinar"},
      // {label: "Trade Show", value: "Trade Show"},
      // {label: "Employee Referral", value: "Employee Referral"},
      // {label: "Customer Event", value: "Customer Event"},
      // {label: "Google AdWords", value: "Google AdWords"},
      // {label: "Purchased List", value: "Purchased List"}, 
      // {label: "Consumers", value: "Consumers"},
      // {label: "Agents", value: "Agents"},
      // {label: "Events", value: "Events"},
      // {label: "ASM", value: "ASM"},
      {label: "Online", value: "Online"},
      {label: "Offline", value: "Offline"},
      {label: "Store Visits", value: "Store Visits"}
    ],
    required: true,
  },
  {
    label: "Sub Lead Source",
    model: ".subLeadSource",
    type: "select",
    options: [
      {label: "Facebook", value: "Facebook"},
      {label: "Google", value: "Google"},
      {label: "Whatsapp", value: "Whatsapp"},
      {label: "Mass Malling", value: "Mass malling"},
      {label: "Mass Messaging", value: "Mass messaging"},
      {label: "Instagram", value: "Instagram"},
      {label: "YouTube", value: "YouTube"},
      {label: "RTO", value: "RTO"},
      {label: "BANK", value: "BANK"},
      {label: "Patpedhi", value: "Patpedhi"},
      {label: "Showroom Tie-Ups", value: "Showroom Tie-Ups"},
    ],
  },
  {
    label: "Lead Status",
    model: ".leadStatus",
    type: "select",
    options: [
      {label: "New", value: "New"},
      {label: "Basic Details", value: "Basic Details"},
      {label: "Document Collection", value: "Document Collection"},
      {label: "Negotiation", value: "Negotiation"},
      {label: "Closed", value: "Closed"},
      {label: "Job Card", value: "Job Card"},
      {label: "Qualified", value: "Qualified"}
    ],
    required: true,
  },
  {
    label: "Rating",
    model: ".rating",
    type: "select",
    options: [
      {label: "Hot", value: "Hot"},
      {label: "Cold", value: "Cold"},
      {label: "Warm", value: "Warm"}
    ],
    required: true,
  },
];

export const leadSource = [
  {
    label: "Lead Type",
    model: ".leadType",
    type: "select",
    options: [
      {label: "B2B", value: "B2B"},
      {label: "B2C", value: "B2C"},
      {label: "B2G", value: "B2G"}
    ],
  },
  {
    label: "Sub Lead Type",
    model: ".subleadType",
    type: "select",
    options: [
      {label: "Customer", value: "Customer"},
      {label: "Influencer", value: "Influencer"},
      {label: "Fitment", value: "Fitment"},
      {label: "Servicing", value: "Servicing"}
    ]
  },
  {
    label: "Lead Source",
    model: ".leadSource",
    type: "select",
    options: [
      // {label: "Partner", value: "Partner"},
      // {label: "Website", value: "Website"},
      // {label: "Advertisement", value: "Advertisement"},
      // {label: "Webinar", value: "Webinar"},
      // {label: "Trade Show", value: "Trade Show"},
      // {label: "Employee Referral", value: "Employee Referral"},
      // {label: "Customer Event", value: "Customer Event"},
      // {label: "Google AdWords", value: "Google AdWords"},
      // {label: "Purchased List", value: "Purchased List"},
      // {label: "Consumers", value: "Consumers"},
      // {label: "Agents", value: "Agents"},
      // {label: "Events", value: "Events"},
      // {label: "ASM", value: "ASM"},
      {label: "Online", value: "Online"},
      {label: "Offline", value: "Offline"},
      {label: "Store Visits", value: "Store Visits"}
    ],
    required: true,
  },
  {
    label: "Sub Lead Source",
    model: ".subLeadSource",
    type: "select",
    options: [
      {label: "Facebook", value: "Facebook"},
      {label: "Google", value: "Google"},
      {label: "Whatsapp", value: "Whatsapp"},
      {label: "Mass Malling", value: "Mass malling"},
      {label: "Mass Messaging", value: "Mass messaging"},
      {label: "Instagram", value: "Instagram"},
      {label: "YouTube", value: "YouTube"},
      {label: "RTO", value: "RTO"},
      {label: "BANK", value: "BANK"},
      {label: "Patpedhi", value: "Patpedhi"},
      {label: "Showroom Tie-Ups", value: "Showroom Tie-Ups"},
    ],
  },
  {
    label: "Lead Status",
    model: ".leadStatus",
    type: "select",
    options: [
      {label: "New", value: "New"},
      {label: "Basic Details", value: "Basic Details"},
      {label: "Document Collection", value: "Document Collection"},
      {label: "Negotiation", value: "Negotiation"},
      {label: "Closed", value: "Closed"},
      {label: "Job Card", value: "Job Card"},
      {label: "Qualified", value: "Qualified"}
    ],
    required: true,
  },
  {
    label: "Rating",
    model: ".rating",
    type: "select",
    options: [
      {label: "Hot", value: "Hot"},
      {label: "Cold", value: "Cold"},
      {label: "Warm", value: "Warm"}
    ],
    required: true,
  },
];

export const addressDetails = [
  {
    label: "Billing Address",
    model: ".billingAddress",
    type: "textarea",
  },
  {
    label: "Shipping Address",
    model: ".shippingAddress",
    type: "textarea",
  },
];

export const gstDetails = [
  {
    label: "GST Number",
    model: ".gstNumber",
    type: "text",
  },
  {
    label: "Compnay Name",
    model: ".compnayName",
    type: "text",
  },
];

export const distCust = [
  {
    label: "First Name",
    model: ".firstName",
    type: "text",
    required: true,
  },
  {
    label: "Middle Name",
    model: ".middleName",
    type: "text",
    required: true,
  },
  {
    label: "Last Name",
    model: ".lastName",
    type: "text",
    required: true,
  },
  {
    label: "City",
    model: ".city",
    type: "text",
    required: true,
  },
  {
    label: "Vehicle No.",
    model: ".vehicleNumber",
    type: "text",
    required: true,
  },
  {
    label: "Vehicle Type",
    model: ".vehicleType",
    type: "text",
    required: true,
  },
  {
    label: "Kit Installed",
    model: ".kitIns",
    type: "text",
    required: true,
  },
  {
    label: "Assigned Dealer",
    model: ".assignedDealers",
    type: "text",
    required: true,
  },
  {
    label: "Dealer Rating",
    model: ".dealerRating",
    type: "text",
    required: true,
  },
];
