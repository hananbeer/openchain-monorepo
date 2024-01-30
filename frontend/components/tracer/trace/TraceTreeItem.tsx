import * as React from 'react';
import TreeItem from '@mui/lab/TreeItem';
import { TreeItemContentSpan } from '../helpers';
import { Property } from 'csstype';
import Color = Property.Color;

type TraceTreeItemProps = {
    nodeId: string;

    treeContent: JSX.Element | JSX.Element[];

    children?: JSX.Element[];
};

type TraceTreeNodeLabelProps = {
    nodeType: string;
    nodeColor: Color;
    onNodeClick?: React.MouseEventHandler<HTMLElement>;
};

export const TraceTreeNodeLabel = (props: TraceTreeNodeLabelProps) => {
    const { nodeType, nodeColor, onNodeClick } = props;

    return (
        <span
            onClick={onNodeClick}
            style={{
                cursor: onNodeClick ? 'pointer' : 'inherit',
                color: nodeColor,
            }}
        >
            [{nodeType}]
        </span>
    );
};

export const TraceTreeItem = (props: TraceTreeItemProps) => {
    const { nodeId, treeContent, children } = props;

    return (
        <TreeItem
            sx={{ border: '1px solid black', borderRadius: '5px', paddingRight: '15px', paddingBottom: '10px', marginTop: '10px' }}
            nodeId={nodeId}
            TransitionProps={{
                mountOnEnter: true,
                unmountOnExit: false,
            }}
            label={<TreeItemContentSpan>{treeContent}</TreeItemContentSpan>}
        >
            {children}
        </TreeItem>
    );
};
