/* tslint:disable */
/* eslint-disable */
/**
 * This file was automatically generated by Payload.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run `payload generate:types` to regenerate this file.
 */

/**
 * Supported timezones in IANA format.
 *
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "supportedTimezones".
 */
export type SupportedTimezones =
  | 'Pacific/Midway'
  | 'Pacific/Niue'
  | 'Pacific/Honolulu'
  | 'Pacific/Rarotonga'
  | 'America/Anchorage'
  | 'Pacific/Gambier'
  | 'America/Los_Angeles'
  | 'America/Tijuana'
  | 'America/Denver'
  | 'America/Phoenix'
  | 'America/Chicago'
  | 'America/Guatemala'
  | 'America/New_York'
  | 'America/Bogota'
  | 'America/Caracas'
  | 'America/Santiago'
  | 'America/Buenos_Aires'
  | 'America/Sao_Paulo'
  | 'Atlantic/South_Georgia'
  | 'Atlantic/Azores'
  | 'Atlantic/Cape_Verde'
  | 'Europe/London'
  | 'Europe/Berlin'
  | 'Africa/Lagos'
  | 'Europe/Athens'
  | 'Africa/Cairo'
  | 'Europe/Moscow'
  | 'Asia/Riyadh'
  | 'Asia/Dubai'
  | 'Asia/Baku'
  | 'Asia/Karachi'
  | 'Asia/Tashkent'
  | 'Asia/Calcutta'
  | 'Asia/Dhaka'
  | 'Asia/Almaty'
  | 'Asia/Jakarta'
  | 'Asia/Bangkok'
  | 'Asia/Shanghai'
  | 'Asia/Singapore'
  | 'Asia/Tokyo'
  | 'Asia/Seoul'
  | 'Australia/Brisbane'
  | 'Australia/Sydney'
  | 'Pacific/Guam'
  | 'Pacific/Noumea'
  | 'Pacific/Auckland'
  | 'Pacific/Fiji';

export interface Config {
  auth: {
    users: UserAuthOperations;
  };
  blocks: {};
  collections: {
    users: User;
    media: Media;
    portfolio: Portfolio;
    'payload-locked-documents': PayloadLockedDocument;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
  };
  collectionsJoins: {};
  collectionsSelect: {
    users: UsersSelect<false> | UsersSelect<true>;
    media: MediaSelect<false> | MediaSelect<true>;
    portfolio: PortfolioSelect<false> | PortfolioSelect<true>;
    'payload-locked-documents': PayloadLockedDocumentsSelect<false> | PayloadLockedDocumentsSelect<true>;
    'payload-preferences': PayloadPreferencesSelect<false> | PayloadPreferencesSelect<true>;
    'payload-migrations': PayloadMigrationsSelect<false> | PayloadMigrationsSelect<true>;
  };
  db: {
    defaultIDType: number;
  };
  globals: {};
  globalsSelect: {};
  locale: null;
  user: User & {
    collection: 'users';
  };
  jobs: {
    tasks: unknown;
    workflows: unknown;
  };
}
export interface UserAuthOperations {
  forgotPassword: {
    email: string;
    password: string;
  };
  login: {
    email: string;
    password: string;
  };
  registerFirstUser: {
    email: string;
    password: string;
  };
  unlock: {
    email: string;
    password: string;
  };
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "users".
 */
export interface User {
  id: number;
  /**
   * Your full name for personalization
   */
  name?: string | null;
  updatedAt: string;
  createdAt: string;
  email: string;
  resetPasswordToken?: string | null;
  resetPasswordExpiration?: string | null;
  salt?: string | null;
  hash?: string | null;
  loginAttempts?: number | null;
  lockUntil?: string | null;
  password?: string | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "media".
 */
export interface Media {
  id: number;
  alt: string;
  updatedAt: string;
  createdAt: string;
  url?: string | null;
  thumbnailURL?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  filesize?: number | null;
  width?: number | null;
  height?: number | null;
  focalX?: number | null;
  focalY?: number | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "portfolio".
 */
export interface Portfolio {
  id: number;
  title: string;
  nav: {
    /**
     * Main text for your hexagon logo
     */
    logo: string;
    /**
     * Character position where gradient effect starts
     */
    logoSplitAt?: number | null;
    /**
     * Subtitle displayed below your logo
     */
    subtitle: string;
    /**
     * Links to display in the navigation menu
     */
    links?:
      | {
          /**
           * URL or anchor link (e.g., #about) for this navigation item
           */
          href: string;
          /**
           * Text to display for this navigation link
           */
          label: string;
          /**
           * Optional icon name (from Lucide icons library)
           */
          icon?: string | null;
          id?: string | null;
        }[]
      | null;
  };
  /**
   * Configure the main hero section at the top of your website
   */
  hero: {
    /**
     * Small greeting text displayed above the main title
     */
    greeting: string;
    /**
     * Main title/headline of your hero section
     */
    title: string;
    /**
     * Brief description about yourself or your services
     */
    description: string;
    /**
     * Your GitHub profile URL (with or without https://)
     */
    githubUrl: string;
    /**
     * Featured image for the hero section
     */
    image?: (number | null) | Media;
    /**
     * Controls how the hero image is positioned within its container when cropped
     */
    imagePosition?:
      | ('center' | 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right')
      | null;
    /**
     * Controls the aspect ratio (width to height ratio) of the hero image. This applies to both mobile and desktop views.
     */
    aspectRatio?: ('landscape' | 'portrait' | 'square' | '21/9' | '4/3' | '1.618/1') | null;
    /**
     * Scale the image (50-200%). Leave empty for default size. Useful for fitting images better within the aspect ratio.
     */
    imageZoom?: number | null;
    /**
     * Precise positioning control (overrides preset position when values are set). Leave empty to use preset position above.
     */
    imageFinePosition?: {
      /**
       * Horizontal position (0-100%). Leave empty to use preset position. 0 = left edge, 50 = center, 100 = right edge
       */
      x?: number | null;
      /**
       * Vertical position (0-100%). Leave empty to use preset position. 0 = top edge, 50 = center, 100 = bottom edge
       */
      y?: number | null;
    };
  };
  /**
   * Configure your portfolio projects section
   */
  projects: {
    /**
     * Title for the projects section
     */
    title: string;
    /**
     * Brief introduction to your projects section
     */
    description: string;
    /**
     * Text displayed above the 'View All on GitHub' button
     */
    viewMoreText?: string | null;
    /**
     * Configure your main featured project (displayed prominently)
     */
    featured: {
      /**
       * Title of your featured project
       */
      title: string;
      /**
       * Detailed description of your featured project (multiple paragraphs for better formatting)
       */
      description?:
        | {
            /**
             * Content for this paragraph
             */
            text: string;
            id?: string | null;
          }[]
        | null;
      /**
       * URL to the live demo of your project (with or without https://)
       */
      projectUrl?: string | null;
      /**
       * URL to the source code repository (with or without https://)
       */
      codeUrl?: string | null;
      /**
       * List of technologies used in this project
       */
      technologies?:
        | {
            /**
             * Name of a technology or tool (e.g., React, Node.js, Tailwind CSS)
             */
            name: string;
            id?: string | null;
          }[]
        | null;
      /**
       * Add multiple images and/or videos for your featured project. If you add multiple items, they will be displayed in a carousel.
       */
      media?:
        | {
            /**
             * Screenshot or thumbnail of your project (used as fallback or video poster)
             */
            image?: (number | null) | Media;
            /**
             * Controls how the image is positioned within its container when cropped
             */
            imagePosition?:
              | (
                  | 'center'
                  | 'top'
                  | 'bottom'
                  | 'left'
                  | 'right'
                  | 'top-left'
                  | 'top-right'
                  | 'bottom-left'
                  | 'bottom-right'
                )
              | null;
            /**
             * Controls the aspect ratio of this media item. Applies to both images and videos.
             */
            aspectRatio?: ('square' | 'landscape' | 'portrait' | '21/9' | '4/3' | '1.618/1') | null;
            /**
             * Scale the image (50-200%). Leave empty for default size. Useful for fitting images better within the aspect ratio.
             */
            imageZoom?: number | null;
            /**
             * Precise positioning control (overrides preset position when values are set). Leave empty to use preset position above.
             */
            imageFinePosition?: {
              /**
               * Horizontal position (0-100%). Leave empty to use preset position. 0 = left edge, 50 = center, 100 = right edge
               */
              x?: number | null;
              /**
               * Vertical position (0-100%). Leave empty to use preset position. 0 = top edge, 50 = center, 100 = bottom edge
               */
              y?: number | null;
            };
            /**
             * Video demo of your project - supports YouTube URLs, direct video files, and uploaded videos
             */
            video?: {
              /**
               * YouTube URL for embedding video demos of your projects.
               */
              src?: string | null;
              /**
               * Alternative: Upload a video file directly (will override URL if both provided)
               */
              file?: (number | null) | Media;
              /**
               * Optional: Title displayed above the video player
               */
              title?: string | null;
              /**
               * Optional: Description displayed below the video title
               */
              description?: string | null;
            };
            id?: string | null;
          }[]
        | null;
    };
    /**
     * Additional projects to display in your portfolio
     */
    items?:
      | {
          /**
           * Title of this project
           */
          title: string;
          /**
           * Detailed description of this project (multiple paragraphs for better formatting)
           */
          description?:
            | {
                /**
                 * Content for this paragraph
                 */
                text: string;
                id?: string | null;
              }[]
            | null;
          /**
           * URL to the live demo of this project (with or without https://)
           */
          projectUrl?: string | null;
          /**
           * URL to the source code repository (with or without https://)
           */
          codeUrl?: string | null;
          /**
           * List of technologies used in this project
           */
          technologies?:
            | {
                /**
                 * Name of a technology or tool (e.g., React, Node.js, Tailwind CSS)
                 */
                name: string;
                id?: string | null;
              }[]
            | null;
          /**
           * Add multiple images and/or videos for this project. If you add multiple items, they will be displayed in a carousel.
           */
          media?:
            | {
                /**
                 * Screenshot or thumbnail of your project (used as fallback or video poster)
                 */
                image?: (number | null) | Media;
                /**
                 * Controls how the image is positioned within its container when cropped
                 */
                imagePosition?:
                  | (
                      | 'center'
                      | 'top'
                      | 'bottom'
                      | 'left'
                      | 'right'
                      | 'top-left'
                      | 'top-right'
                      | 'bottom-left'
                      | 'bottom-right'
                    )
                  | null;
                /**
                 * Controls the aspect ratio of this media item. Applies to both images and videos.
                 */
                aspectRatio?: ('square' | 'landscape' | 'portrait' | '21/9' | '4/3' | '1.618/1') | null;
                /**
                 * Scale the image (50-200%). Leave empty for default size. Useful for fitting images better within the aspect ratio.
                 */
                imageZoom?: number | null;
                /**
                 * Precise positioning control (overrides preset position when values are set). Leave empty to use preset position above.
                 */
                imageFinePosition?: {
                  /**
                   * Horizontal position (0-100%). Leave empty to use preset position. 0 = left edge, 50 = center, 100 = right edge
                   */
                  x?: number | null;
                  /**
                   * Vertical position (0-100%). Leave empty to use preset position. 0 = top edge, 50 = center, 100 = bottom edge
                   */
                  y?: number | null;
                };
                /**
                 * Video demo of your project - supports YouTube URLs, direct video files, and uploaded videos
                 */
                video?: {
                  /**
                   * YouTube URL for embedding video demos of your projects.
                   */
                  src?: string | null;
                  /**
                   * Alternative: Upload a video file directly (will override URL if both provided)
                   */
                  file?: (number | null) | Media;
                  /**
                   * Optional: Title displayed above the video player
                   */
                  title?: string | null;
                  /**
                   * Optional: Description displayed below the video title
                   */
                  description?: string | null;
                };
                id?: string | null;
              }[]
            | null;
          id?: string | null;
        }[]
      | null;
    /**
     * URL to view all your projects (typically your GitHub profile)
     */
    viewAllLink?: string | null;
  };
  /**
   * Configure the about section of your portfolio
   */
  about: {
    /**
     * Title for the about section
     */
    title: string;
    /**
     * Heading for the technologies/skills subsection
     */
    technologiesHeading: string;
    /**
     * Heading for the interests/hobbies subsection
     */
    interestsHeading: string;
    /**
     * Text paragraphs describing yourself and your background
     */
    paragraphs?:
      | {
          /**
           * Content for this paragraph
           */
          text: string;
          id?: string | null;
        }[]
      | null;
    /**
     * List of technologies, languages, and tools you're proficient with
     */
    technologies?:
      | {
          /**
           * Name of a technology or skill (e.g., React, JavaScript, UI Design)
           */
          name: string;
          id?: string | null;
        }[]
      | null;
    /**
     * List of your interests and hobbies outside of work
     */
    interests?:
      | {
          /**
           * Name of an interest or hobby (e.g., Photography, Hiking, Reading)
           */
          name: string;
          id?: string | null;
        }[]
      | null;
    /**
     * Image to display in the about section (e.g., your photo)
     */
    image?: (number | null) | Media;
    /**
     * Controls how the about image is positioned within its container when cropped
     */
    imagePosition?:
      | ('center' | 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right')
      | null;
    /**
     * Controls the aspect ratio (width to height ratio) of the about image. This applies to both mobile and desktop views.
     */
    aspectRatio?: ('square' | 'landscape' | 'portrait' | '21/9' | '4/3' | '1.618/1') | null;
    /**
     * Scale the image (50-200%). Leave empty for default size. Useful for fitting images better within the aspect ratio.
     */
    imageZoom?: number | null;
    /**
     * Precise positioning control (overrides preset position when values are set). Leave empty to use preset position above.
     */
    imageFinePosition?: {
      /**
       * Horizontal position (0-100%). Leave empty to use preset position. 0 = left edge, 50 = center, 100 = right edge
       */
      x?: number | null;
      /**
       * Vertical position (0-100%). Leave empty to use preset position. 0 = top edge, 50 = center, 100 = bottom edge
       */
      y?: number | null;
    };
  };
  /**
   * Configure the contact section of your portfolio
   */
  contact: {
    /**
     * Title for the contact section
     */
    title: string;
    /**
     * Brief introduction to your contact section
     */
    description: string;
    /**
     * Your contact email address
     */
    email: string;
    /**
     * Subtitle text displayed on the email contact card
     */
    emailSubtitle: string;
    /**
     * Your GitHub username or full URL
     */
    github: string;
    /**
     * Subtitle text displayed on the GitHub contact card
     */
    githubSubtitle: string;
    /**
     * Title for the call-to-action card
     */
    ctaTitle: string;
    /**
     * Description text for the call-to-action card
     */
    ctaDescription: string;
  };
  /**
   * Configure the footer section of your portfolio
   */
  footer: {
    /**
     * Copyright notice displayed in the footer
     */
    copyright: string;
  };
  updatedAt: string;
  createdAt: string;
  _status?: ('draft' | 'published') | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-locked-documents".
 */
export interface PayloadLockedDocument {
  id: number;
  document?:
    | ({
        relationTo: 'users';
        value: number | User;
      } | null)
    | ({
        relationTo: 'media';
        value: number | Media;
      } | null)
    | ({
        relationTo: 'portfolio';
        value: number | Portfolio;
      } | null);
  globalSlug?: string | null;
  user: {
    relationTo: 'users';
    value: number | User;
  };
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-preferences".
 */
export interface PayloadPreference {
  id: number;
  user: {
    relationTo: 'users';
    value: number | User;
  };
  key?: string | null;
  value?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-migrations".
 */
export interface PayloadMigration {
  id: number;
  name?: string | null;
  batch?: number | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "users_select".
 */
export interface UsersSelect<T extends boolean = true> {
  name?: T;
  updatedAt?: T;
  createdAt?: T;
  email?: T;
  resetPasswordToken?: T;
  resetPasswordExpiration?: T;
  salt?: T;
  hash?: T;
  loginAttempts?: T;
  lockUntil?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "media_select".
 */
export interface MediaSelect<T extends boolean = true> {
  alt?: T;
  updatedAt?: T;
  createdAt?: T;
  url?: T;
  thumbnailURL?: T;
  filename?: T;
  mimeType?: T;
  filesize?: T;
  width?: T;
  height?: T;
  focalX?: T;
  focalY?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "portfolio_select".
 */
export interface PortfolioSelect<T extends boolean = true> {
  title?: T;
  nav?:
    | T
    | {
        logo?: T;
        logoSplitAt?: T;
        subtitle?: T;
        links?:
          | T
          | {
              href?: T;
              label?: T;
              icon?: T;
              id?: T;
            };
      };
  hero?:
    | T
    | {
        greeting?: T;
        title?: T;
        description?: T;
        githubUrl?: T;
        image?: T;
        imagePosition?: T;
        aspectRatio?: T;
        imageZoom?: T;
        imageFinePosition?:
          | T
          | {
              x?: T;
              y?: T;
            };
      };
  projects?:
    | T
    | {
        title?: T;
        description?: T;
        viewMoreText?: T;
        featured?:
          | T
          | {
              title?: T;
              description?:
                | T
                | {
                    text?: T;
                    id?: T;
                  };
              projectUrl?: T;
              codeUrl?: T;
              technologies?:
                | T
                | {
                    name?: T;
                    id?: T;
                  };
              media?:
                | T
                | {
                    image?: T;
                    imagePosition?: T;
                    aspectRatio?: T;
                    imageZoom?: T;
                    imageFinePosition?:
                      | T
                      | {
                          x?: T;
                          y?: T;
                        };
                    video?:
                      | T
                      | {
                          src?: T;
                          file?: T;
                          title?: T;
                          description?: T;
                        };
                    id?: T;
                  };
            };
        items?:
          | T
          | {
              title?: T;
              description?:
                | T
                | {
                    text?: T;
                    id?: T;
                  };
              projectUrl?: T;
              codeUrl?: T;
              technologies?:
                | T
                | {
                    name?: T;
                    id?: T;
                  };
              media?:
                | T
                | {
                    image?: T;
                    imagePosition?: T;
                    aspectRatio?: T;
                    imageZoom?: T;
                    imageFinePosition?:
                      | T
                      | {
                          x?: T;
                          y?: T;
                        };
                    video?:
                      | T
                      | {
                          src?: T;
                          file?: T;
                          title?: T;
                          description?: T;
                        };
                    id?: T;
                  };
              id?: T;
            };
        viewAllLink?: T;
      };
  about?:
    | T
    | {
        title?: T;
        technologiesHeading?: T;
        interestsHeading?: T;
        paragraphs?:
          | T
          | {
              text?: T;
              id?: T;
            };
        technologies?:
          | T
          | {
              name?: T;
              id?: T;
            };
        interests?:
          | T
          | {
              name?: T;
              id?: T;
            };
        image?: T;
        imagePosition?: T;
        aspectRatio?: T;
        imageZoom?: T;
        imageFinePosition?:
          | T
          | {
              x?: T;
              y?: T;
            };
      };
  contact?:
    | T
    | {
        title?: T;
        description?: T;
        email?: T;
        emailSubtitle?: T;
        github?: T;
        githubSubtitle?: T;
        ctaTitle?: T;
        ctaDescription?: T;
      };
  footer?:
    | T
    | {
        copyright?: T;
      };
  updatedAt?: T;
  createdAt?: T;
  _status?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-locked-documents_select".
 */
export interface PayloadLockedDocumentsSelect<T extends boolean = true> {
  document?: T;
  globalSlug?: T;
  user?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-preferences_select".
 */
export interface PayloadPreferencesSelect<T extends boolean = true> {
  user?: T;
  key?: T;
  value?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-migrations_select".
 */
export interface PayloadMigrationsSelect<T extends boolean = true> {
  name?: T;
  batch?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "auth".
 */
export interface Auth {
  [k: string]: unknown;
}


declare module 'payload' {
  export interface GeneratedTypes extends Config {}
}