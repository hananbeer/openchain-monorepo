import { ParamType, Result } from 'ethers';
import { TraceMetadata } from './types';
import WithSeparator from 'react-with-separator';
import { DataRenderer } from './DataRenderer';
import * as React from 'react';
import { Property } from 'csstype';
import Color = Property.Color;

type ParamFlatViewProps = {
    traceMetadata: TraceMetadata;
    params: ParamType[];
    values: Result;

    generateNames?: boolean;
    nameColor?: Color;
};

export const ParamFlatView = (props: ParamFlatViewProps) => {
    let generateNames = props.generateNames === true;
    let nameColor = props.nameColor || '#a8a19f';

    let recursivelyRenderParams = (params: readonly ParamType[], values: Result): JSX.Element => {
        return (
            
            <div style={{ paddingLeft: '15px' }}>
                <WithSeparator separator={<br />}>
                    {params.map((param, idx) => {
                        let value = values[idx];

                        let name = param.name;
                        if (!name && generateNames) {
                            name = `var_${idx}`;
                        }

                        let rendered: JSX.Element;
                        if (param.baseType === 'tuple') {
                            rendered = <>({recursivelyRenderParams(param.components!, value)})</>;
                        } else if (param.baseType === 'array') {
                            rendered = (
                                <>[{recursivelyRenderParams(Array(value.length).fill(param.arrayChildren), value)}]</>
                            );
                        } else {
                            rendered = (
                                <DataRenderer decodedData={value} preferredType={param} truncate={true}></DataRenderer>
                            );
                        }

                        // if (name) {
                        let typeName = param.type
                        if (typeName.includes("(")) {
                            typeName = typeName.split('(')[0] + typeName.split(')').at(-1)
                        }
                        // if (typeName == 'string') {
                        //     rendered = <>"{rendered}"</>
                        // }
                        return (
                            <React.Fragment key={`param_${idx}`}>
                                <span style={{ color: nameColor }}>{typeName} {name}</span> {rendered}
                            </React.Fragment>
                        );
                        // } else {
                        //     return <React.Fragment key={`param_${idx}`}>{rendered}</React.Fragment>;
                        // }
                    })}
                </WithSeparator></div>
        );
    };

    return <>{recursivelyRenderParams(props.params, props.values)}</>;
};
