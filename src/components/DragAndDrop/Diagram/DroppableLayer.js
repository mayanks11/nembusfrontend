import styled from 'styled-components';

const DroppableLayer = styled.div.attrs(({ disabled, ...props }) => ({
  ...props,
  onDragOver: event => event.preventDefault(),
  onDrop: event => {
    if (disabled) return;

    console.log("event.dataTransfer.getData('component')",event.dataTransfer.getData('deltav-block-type'),
    
    )

    const component = JSON.parse(
      event.dataTransfer.getData('deltav-block-type'),
    );

    props.handleComponentDrop(event, component);
  },
}))`
  width: 100vw;
  height: 100vh;
`;

export default DroppableLayer;
