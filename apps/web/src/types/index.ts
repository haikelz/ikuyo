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
