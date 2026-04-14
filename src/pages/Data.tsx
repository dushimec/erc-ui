// types.ts (or keep in the same file)

export interface ContentBlock {
  id: string;
  content: string;
}

export interface ContentBlockWithCapital {
  id: string;
  Content: string; // notice capital "C" from your original
}

export interface CommunityItem {
  id: number;
  title: string;
  total: number;
  content: string;
}

export interface CommunityData {
  Data: CommunityItem[];
}

// ---------------------
// Data exports
// ---------------------

export const WhoWeAre: ContentBlock = {
  id: "1",
  content:
    "We are a Christ-centered community dedicated to spreading the gospel, nurturing spiritual growth, and building strong families. Our church is a home for all, where faith, hope, and love come alive through service and fellowship.",
};

export const Vision: ContentBlockWithCapital = {
  id: "1",
  Content:
    "A vision statement describes an organization's long-term aspirations and the future it wants to achieve, while a mission statement defines its present-day purpose, what it does, and how it will accomplish its vision",
};

export const Mission: ContentBlockWithCapital = {
  id: "1",
  Content:
    "IKEA's mission to offer a wide range of well-designed, functional home furnishing products at prices so low that as many people as possible will be able to afford them",
};

export const History: ContentBlockWithCapital = {
  id: "1",
  Content:
    "A vision statement describes an organization's long-term aspirations and the future it wants to achieve, while a mission statement defines its present-day purpose, what it does, and how it will accomplish its vision",
};

export const StartUp: ContentBlock = {
  id: "",
  content:
    "The start-up of the Evangelical Restoration Church (ERC) in Rwanda was rooted in a vision by Apostle Joshua Masasu to establish a 'Family Church' that restores people spiritually, emotionally, and physically, stemming from a time when Rwanda was described as a 'valley of dry bones'. The church grew from fewer than 100 followers to thousands, establishing its presence through faith, community, and a vision to 'raise an Army of Disciples of Jesus Christ'. The church has since expanded significantly, with plans for construction of major facilities, including a new global headquarters complex in Kigali.",
};

export const Community: CommunityData = {
  Data: [
    {
      id: 1,
      title: "Youth",
      total: 500,
      content: "People",
    },
    {
      id: 2,
      title: "Children",
      total: 200,
      content: "People",
    },
    {
      id: 3,
      title: "Women",
      total: 700,
      content: "People",
    },
    {
      id: 4,
      title: "Men",
      total: 600,
      content: "People",
    },
  ],
};
