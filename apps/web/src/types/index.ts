export type GuestbookProps = {
  id: number;
  created_at: Date;
  email: string;
  username: string;
  message: string;
};

export type HeadingTocProps = {
  depth: number;
  text: string;
  slug: string;
};

export interface HeadingNodeTocProps extends HeadingTocProps {
  subheadings: HeadingNodeTocProps[];
}

export type WakatimeStatsProps = {
  id: string;
  user_id: string;
  range: "all_time" | "last_7_days" | "last_30_days" | "last_6_months" | "last_year";
  timeout: number;
  holidays: number;
  status: "ok" | "pending" | "error";
  days_including_holidays: number;
  languages: LanguageProps[];
  human_readable_total_including_other_language: string;
  total_seconds_including_other_language: number;
  total_seconds: number;
  days_minus_holidays: number;
  daily_average_including_other_language: number;
  is_up_to_date: boolean;
  operating_systems: OperatingSystemProps[];
  human_readable_total: string;
  human_readable_daily_average_including_other_language: string;
  human_readable_daily_average: string;
  daily_average: number;
  categories: CategoryProps[];
  percent_calculated: number;
  editors: EditorProps[];
  is_cached: boolean;
  username: string;
  human_readable_range: string;
  is_coding_activity_visible: boolean;
  is_language_usage_visible: boolean;
  is_editor_usage_visible: boolean;
  is_category_usage_visible: boolean;
  is_os_usage_visible: boolean;
};

export type LanguageProps = {
  name: string;
  total_seconds: number;
  percent: number;
  digital: string;
  decimal: string;
  text: string;
  hours: number;
  minutes: number;
  seconds: number;
};

export type OperatingSystemProps = {
  name: string;
  total_seconds: number;
  percent: number;
  digital: string;
  decimal: string;
  text: string;
  hours: number;
  minutes: number;
  seconds: number;
};

export type CategoryProps = {
  name: string;
  total_seconds: number;
  percent: number;
  digital: string;
  decimal: string;
  text: string;
  hours: number;
  minutes: number;
  seconds: number;
};

export type EditorProps = {
  name: string;
  total_seconds: number;
  percent: number;
  digital: string;
  decimal: string;
  text: string;
  hours: number;
  minutes: number;
  seconds: number;
};
