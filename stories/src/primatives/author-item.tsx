import React, { Component, ReactElement } from 'react';
import styled from '@emotion/styled';
import { colors } from '@atlaskit/theme';
import type {
  DraggableProvided,
  DraggableStateSnapshot,
} from '@hello-pangea/dnd';
import { grid } from '../constants';
import type { Author } from '../types';

interface AvatarProps {
  isDragging: boolean;
}

const Avatar = styled.img<AvatarProps>`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-right: ${grid}px;
  border-color: ${({ isDragging }) => (isDragging ? colors.G50 : colors.N0)};
  border-style: solid;
  border-width: ${grid}px;
  box-shadow: ${({ isDragging }) =>
    isDragging ? `2px 2px 1px ${colors.N200}` : 'none'};

  &:focus {
    /* disable standard focus color */
    outline: none;

    /* use our own awesome one */
    border-color: ${({ isDragging }) =>
      isDragging ? colors.G50 : colors.B200};
  }
`;

interface Props {
  author: Author;
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
}

export default class AuthorItem extends Component<Props> {
  render(): ReactElement {
    const author: Author = this.props.author;
    const provided: DraggableProvided = this.props.provided;
    const snapshot: DraggableStateSnapshot = this.props.snapshot;

    return (
      <Avatar
        ref={(ref) => provided.innerRef(ref)}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        src={author.avatarUrl}
        alt={author.name}
        isDragging={snapshot.isDragging}
      />
    );
  }
}
