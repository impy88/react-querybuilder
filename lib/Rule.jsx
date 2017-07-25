import React from 'react';

export default class Rule extends React.Component {
    static get defaultProps() {
        return {
            id: null,
            parentId: null,
            parentGroupId: null,
            field: null,
            operator: null,
            combinator: null,
            value: null,
            schema: null
        };
    }

    render() {
        const {idx, field, operator, value, rules, combinator, schema: {fields, controls, getOperators, getLevel, classNames}} = this.props;
        var level = getLevel(this.props.id);
        const inOnlyOneRule = level === 0 && rules.length === 1;
        const isMainRule = level === 0 && idx === 0;

        const Container = controls.container
        const Controls = controls.controls

        return (
            <Container className={`rule`} title={isMainRule ? 'Select' : combinator} level={level}>
                {
                    React.createElement(controls.fieldSelector,
                        {
                            options: fields,
                            value: field,
                            className: `rule-fields ${classNames.fields}`,
                            handleOnChange: this.onFieldChanged, 
                            level: level
                        }
                    )
                }
                {
                    React.createElement(controls.operatorSelector,
                        {
                            field: field,
                            options: getOperators(field),
                            value: operator,
                            className: `rule-operators ${classNames.operators}`,
                            handleOnChange: this.onOperatorChanged, 
                            level: level
                        }
                    )
                }
                {
                    React.createElement(controls.valueEditor,
                        {
                            field: field,
                            operator: operator,
                            value: value,
                            className: `rule-value ${classNames.value}`,
                            handleOnChange: this.onValueChanged, 
                            level: level
                        }
                    )
                }
                <Controls>
                    {
                        React.createElement(controls.addRuleAction,
                            {
                                label: 'AND',
                                className: `ruleGroup-addRule ${classNames.addRule}`,
                                handleOnClick:  e => this.addRule(e, 'and'),
                                rules: rules, 
                                level: level
                            }
                        )
                    }
                    {
                        React.createElement(controls.addRuleAction,
                            {
                                label: 'OR',
                                className: `ruleGroup-addRule ${classNames.addRule}`,
                                handleOnClick:  e => this.addRule(e, 'or'),
                                rules: rules,
                                level: level
                            }
                        )
                    }
                    {
                        !inOnlyOneRule ?
                            React.createElement(controls.removeRuleAction,
                            {
                                label: 'x',
                                className: `rule-remove ${classNames.removeRule}`,
                                handleOnClick: this.removeRule, 
                                level: level
                            })
                            : null
                    }
                </Controls>
            </Container>
        );
    }

    onFieldChanged = (value) => {
        this.onElementChanged('field', value);
    }

    onOperatorChanged = (value) => {
        this.onElementChanged('operator', value);
    }

    onValueChanged = (value) => {
        this.onElementChanged('value', value);
    }

    onElementChanged = (property, value) => {
        const {id, schema: {onPropChange}} = this.props;

        onPropChange(property, value, id);
    }

    addRule = (event, combinator) => {
        /*
         * if clicked on the same group name -> add a rule
         * if not -> add a group + rule
         * first rule sets a combinator and don't produces any group
         */
        const { rules } = this.props;

        const {createRuleGroup, onGroupAdd, createRule, onRuleAdd, onPropChange} = this.props.schema;

        if (rules.length <= 1) {
            onPropChange('combinator', combinator, this.props.parentId);
            onRuleAdd(createRule(), this.props.parentId)
        } else if (this.props.combinator !== combinator) {
            const newGroup = createRuleGroup(combinator);
            onGroupAdd(newGroup, this.props.parentId)
         } else {
            onRuleAdd(createRule(), this.props.parentId)
         }

         
    }

    removeRule = (event) => {
        event.preventDefault();
        event.stopPropagation();

        const {onRuleRemove} = this.props.schema;
        const { id, parentId, parentGroupId } = this.props;

        onRuleRemove(id, parentId, parentGroupId);
    }


}
