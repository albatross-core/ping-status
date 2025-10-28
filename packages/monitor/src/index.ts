import { z } from "zod/v4";

const MIN_STATUS_CODE = 100;
const MAX_STATUS_CODE = 599;

const MIN_TIMEOUT = 1000; // 1 second
const MAX_TIMEOUT = 60_000; // 1 minute
const DEFAULT_TIMEOUT = 20_000; // 20 seconds

const MIN_DEGRADED_THRESHOLD = 10; // 10 ms
const MAX_DEGRADED_THRESHOLD = MAX_TIMEOUT; // 1 minute

export const monitorSchema = z.object({
  name: z.string().min(1),
  url: z.url(),
  method: z.enum(["GET", "POST", "PUT"]).default("GET"),
  headers: z.record(z.string(), z.string()).optional(),
  body: z.union([z.record(z.string(), z.any()), z.string()]).optional(),
  timeout: z
    .number()
    .min(MIN_TIMEOUT)
    .max(MAX_TIMEOUT)
    .default(DEFAULT_TIMEOUT),
  degradedThreshold: z
    .number()
    .min(MIN_DEGRADED_THRESHOLD)
    .max(MAX_DEGRADED_THRESHOLD)
    .optional(),
  maxRetries: z.number().min(0).max(5).default(2),
  retryDelay: z.number().min(100).max(3000).default(1000),
  validator: z.function({
    input: [
      z.object({
        status: z.number().min(MIN_STATUS_CODE).max(MAX_STATUS_CODE),
        body: z.string(),
        headers: z.record(z.string(), z.string()),
      }),
    ],
    output: z.discriminatedUnion("success", [
      z.object({
        success: z.literal(true),
      }),
      z.object({
        success: z.literal(false),
        message: z.string(),
      }),
    ]),
  }),
});

type MonitorConfig = z.input<typeof monitorSchema>;

export type Monitor = z.infer<typeof monitorSchema>;

const monitor = (config: MonitorConfig): Monitor => {
  return monitorSchema.parse(config);
};

export const monitors = [
  monitor({
    timeout: 5000,
    degradedThreshold: 3000,
    name: "Website",
    url: "https://usealbatross.ai",
    validator: ({ status }) =>
      status === 200
        ? { success: true }
        : { success: false, message: "Status code is not 200" },
  }),
  monitor({
    timeout: 5000,
    degradedThreshold: 3000,
    name: "App API Health",
    url: "https://app.usealbatross.ai/api/health",
    validator: ({ status }) =>
      status === 200
        ? { success: true }
        : { success: false, message: "Status code is not 200" },
  }),
  monitor({
    timeout: 5000,
    degradedThreshold: 3000,
    name: "WP Event Health",
    url: "https://app.wp.usealbatross.ai/api/event/health",
    validator: ({ status }) =>
      status === 200
        ? { success: true }
        : { success: false, message: "Status code is not 200" },
  }),
  monitor({
    timeout: 5000,
    degradedThreshold: 3000,
    name: "WP Catalog Health",
    url: "https://app.wp.usealbatross.ai/api/catalog/health",
    validator: ({ status }) =>
      status === 200
        ? { success: true }
        : { success: false, message: "Status code is not 200" },
  }),
  monitor({
    timeout: 5000,
    degradedThreshold: 3000,
    name: "CC Event",
    url: "https://app.usealbatross.ai/api/event/accommodation_details_open?notrace=true",
    method: "PUT",
    body: {
      eventType: "accommodation_details_open",
      units: {},
      payload: {},
    },
    headers: {
      "x-instance-id": "0b4f0590-bee1-11ef-85d9-42010aac0023",
      Authorization: `Bearer ${process.env.CC_SECRET_TOKEN}`,
    },
    validator: ({ status }) =>
      status === 201
        ? { success: true }
        : { success: false, message: "Status code is not 201" },
  }),
  monitor({
    timeout: 5000,
    degradedThreshold: 3000,
    name: "HC Prediction",
    url: "https://app.usealbatross.ai/api/use-case/prediction?notrace=true",
    method: "POST",
    body: {
      useCase: { uuid: "e3baad98-161c-11f0-9882-068cf85ff8bb" },
      context: {
        num_days_to_checkin_date: "2025-09-25",
        is_family_friendly: "true",
        rooms_number: "7",
        directFlight: "directFlight_value",
        has_direct_beach_access: "true",
        is_deal: "false",
        is_flex: "false",
        stars: "stars_value",
      },
      actions: [
        {
          hotel_id: "hotel_id-0r0pmyb",
          trip_duration: "trip_duration_value",
          number_of_adults: "4",
          number_of_child: "6",
          season: "season_value",
          departure_airport_1: "departure_airport_1_value",
          departure_airport_2: "departure_airport_2_value",
          departure_airport_3: "departure_airport_3_value",
          min_price: "185.10",
          max_price: "376.79",
          weighted_mean_price: "449.08",
          weighted_mean_price_squared: "512.56",
          coefficient_of_variation: "coefficient_of_variation_value",
          offer_count: "10",
          return_early_morning_flight_pct:
            "return_early_morning_flight_pct_value",
          return_morning_flight_pct: "return_morning_flight_pct_value",
          return_afternoon_flight_pct: "return_afternoon_flight_pct_value",
          return_evening_flight_pct: "return_evening_flight_pct_value",
          departure_early_morning_flight_pct:
            "departure_early_morning_flight_pct_value",
          departure_morning_flight_pct: "departure_morning_flight_pct_value",
          departure_afternoon_flight_pct:
            "departure_afternoon_flight_pct_value",
          departure_evening_flight_pct: "departure_evening_flight_pct_value",
          direct_flight_pct: "direct_flight_pct_value",
          total_displayed_price_quantile: "406.11",
          distance_from_max_duration: "false",
          review_suns: "review_suns_value",
          recommendation_rate: "recommendation_rate_value",
          deal: "deal_value",
          total_displayed_price: "473.49",
          review_count: "5",
          booking_score: "4.8",
          picture_count: "1",
        },
      ],
    },
    headers: {
      "x-instance-id": "dcc3ab36-21b5-11f0-8db0-42010aac0024",
      Authorization: `Bearer ${process.env.HC_SECRET_TOKEN}`,
      "Content-Type": "application/json",
    },
    validator: ({ status }) =>
      status === 200
        ? { success: true }
        : { success: false, message: "Status code is not 200" },
  }),
];
