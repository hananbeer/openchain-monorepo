import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TreeItem from '@mui/lab/TreeItem';
import TreeView from '@mui/lab/TreeView';
import { ParamType, Result } from 'ethers';
import * as React from 'react';
import { DataRenderer } from './DataRenderer';
import { TreeItemContentSpan } from './helpers';

// oh for fuck's sake
const cloneParamType = (input: ParamType, overrides?: Record<string, any>): ParamType => {
    const base = ParamType.from('uint256');

    Object.defineProperty(base, Symbol.for('_ethers_internal'), {
        value: '_ParamTypeInternal',
    });

    const values = {
        name: input.name,
        type: input.type,
        baseType: input.baseType,
        indexed: input.indexed,
        components: input.components,
        arrayLength: input.arrayLength,
        arrayChildren: input.arrayChildren,
        ...overrides,
    };

    for (const [key, value] of Object.entries(values)) {
        Object.defineProperty(base, key, {
            enumerable: true,
            value: value,
            writable: false,
        });
    }

    return base;
};

type ParamTreeViewProps = {
    path: string;
    params: readonly ParamType[];
    values: Result;
    title: string;
};

const nameColor = '#a8a19f';

export const ParamTreeView = (props: ParamTreeViewProps) => {
    let recursivelyRenderParams = (path: string, params: readonly ParamType[], values: Result): JSX.Element[] => {
        return params.map((param, idx) => {
            let paramName = param.name || `var_${idx}`;
            let typeName = param.type
            if (typeName.includes("(")) {
                typeName = typeName.split('(')[0] + typeName.split(')').at(-1)
            }

            let nodeId = path + '.' + idx;
            let value = values[idx];

            let label: JSX.Element;
            let children: JSX.Element[];
            if (param.isTuple()) {
                label = <span style={{ color: nameColor }}>{typeName} {paramName}</span>
                children = recursivelyRenderParams(nodeId + '.', param.components, value);
            } else if (param.isArray()) {
                label = <span style={{ color: nameColor }}>{typeName} {paramName}</span>
                const paramsRemapped = [];
                for (let i = 0; i < value.length; i++) {
                    paramsRemapped.push(
                        cloneParamType(param.arrayChildren, {
                            name: paramName + `[${i}]`,
                        }),
                    );
                }
                children = recursivelyRenderParams(nodeId + '[]', paramsRemapped, value);
            } else {
                label = (
                    <>
                        <span style={{ color: nameColor }}>{typeName} {paramName}</span>
                        &nbsp;
                        <DataRenderer decodedData={value} preferredType={param}></DataRenderer>
                    </>
                );
                children = [];
            }

            return (
                <TreeItem key={nodeId} nodeId={nodeId} label={<TreeItemContentSpan>{label}</TreeItemContentSpan>}>
                    {children}
                </TreeItem>
            );
        });
    };

    return (
        <TreeView
            aria-label="rich object"
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpanded={[props.path + '.' + props.title]}
            defaultExpandIcon={<ChevronRightIcon />}
            // sx={{
            //     paddingBottom: '20px',
            // }}
        >
          <TreeItem nodeId={props.path + '.' + props.title} label={props.title}>
            {recursivelyRenderParams(props.path + '.root', props.params, props.values)}
          </TreeItem>
        </TreeView>
    );
};