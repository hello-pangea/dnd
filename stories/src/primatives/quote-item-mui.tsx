import React, { CSSProperties } from 'react';
import styled from '@emotion/styled';
import { colors } from '@atlaskit/theme';
import type { DraggableProvided } from '@hello-pangea/dnd';
import { Box, Card, Chip, Grid, Typography } from '@mui/material';
import { grid } from '../constants';
import type { Quote, AuthorColors } from '../types';

interface Props {
  quote: Quote;
  isDragging: boolean;
  provided: DraggableProvided;
  isClone?: boolean;
  isGroupedOver?: boolean;
  style?: CSSProperties;
  index?: number;
  variant: 'card' | 'box';
}

const getBackgroundColor = (
  isDragging: boolean,
  isGroupedOver: boolean,
  authorColors: AuthorColors,
) => {
  if (isDragging) {
    return authorColors.soft;
  }

  if (isGroupedOver) {
    return colors.N30;
  }

  return colors.N0;
};

const getBorderColor = (isDragging: boolean, authorColors: AuthorColors) =>
  isDragging ? authorColors.hard : 'transparent';

const imageSize = 40;

const CloneBadge = styled.div`
  background: ${colors.G100};
  bottom: ${grid / 2}px;
  border: 2px solid ${colors.G200};
  border-radius: 50%;
  box-sizing: border-box;
  font-size: 10px;
  position: absolute;
  right: -${imageSize / 3}px;
  top: -${imageSize / 3}px;
  transform: rotate(40deg);

  height: ${imageSize}px;
  width: ${imageSize}px;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const Avatar = styled.img`
  width: ${imageSize}px;
  height: ${imageSize}px;
  border-radius: 50%;
  margin-right: ${grid}px;
  flex-shrink: 0;
  flex-grow: 0;
`;

function getStyle(provided: DraggableProvided, style?: CSSProperties | null) {
  if (!style) {
    return provided.draggableProps.style;
  }

  return {
    ...provided.draggableProps.style,
    ...style,
  };
}

interface ContainerProps extends Props {
  children: React.ReactNode;
  variant: 'card' | 'box';
}

function Container({ children, variant, ...props }: ContainerProps) {
  if (variant === 'card') {
    return (
      <Card
        ref={props.provided.innerRef}
        {...props.provided.draggableProps}
        {...props.provided.dragHandleProps}
        style={getStyle(props.provided, props.style)}
        data-is-dragging={props.isDragging}
        data-testid={props.quote.id}
        data-index={props.index}
        aria-label={`${props.quote.author.name} quote ${props.quote.content}`}
        sx={{
          p: `${grid}px`,
          marginBottom: `${grid}px`,
          backgroundColor: getBackgroundColor(
            props.isDragging,
            Boolean(props.isGroupedOver),
            props.quote.author.colors,
          ),
          border: '2px solid transparent',
          borderColor: getBorderColor(
            props.isDragging,
            props.quote.author.colors,
          ),
        }}
      >
        {children}
      </Card>
    );
  }

  return (
    <Box
      ref={props.provided.innerRef}
      {...props.provided.draggableProps}
      {...props.provided.dragHandleProps}
      style={getStyle(props.provided, props.style)}
      data-is-dragging={props.isDragging}
      data-testid={props.quote.id}
      data-index={props.index}
      aria-label={`${props.quote.author.name} quote ${props.quote.content}`}
      sx={{
        p: `${grid}px`,
        backgroundColor: getBackgroundColor(
          props.isDragging,
          Boolean(props.isGroupedOver),
          props.quote.author.colors,
        ),
        borderBottom: props.isDragging ? 0 : 1,
        borderColor: 'divider',
        borderRadius: props.isDragging ? 1 : 0,
        boxShadow: props.isDragging ? 3 : 0,
      }}
    >
      {children}
    </Box>
  );
}

// Previously this extended React.Component
// That was a good thing, because using React.PureComponent can hide
// issues with the selectors. However, moving it over does can considerable
// performance improvements when reordering big lists (400ms => 200ms)
// Need to be super sure we are not relying on PureComponent here for
// things we should be doing in the selector as we do not know if consumers
// will be using PureComponent
function QuoteItemMUI(props: Props) {
  const { quote, isClone } = props;

  return (
    <Container {...props}>
      <Grid container>
        <Grid item xs="auto">
          <Avatar src={quote.author.avatarUrl} alt={quote.author.name} />
          {isClone ? <CloneBadge>Clone</CloneBadge> : null}
        </Grid>
        <Grid item xs>
          <Typography gutterBottom>{quote.content}</Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Chip
              label={quote.author.name}
              size="small"
              sx={{
                color: quote.author.colors.hard,
                backgroundColor: quote.author.colors.soft,
              }}
            />
            <Typography variant="caption">id:{quote.id}</Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default React.memo<Props>(QuoteItemMUI);
