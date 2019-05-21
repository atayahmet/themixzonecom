declare module 'disqus-react' {
  export interface IDiscussionEmbedProps {
    shortname: string
    config: any;
  }

  export class CommentEmbed {}
  export class CommentCount extends React.Component<IDiscussionEmbedProps> {}
  export class DiscussionEmbed extends React.Component<IDiscussionEmbedProps> {}
}
