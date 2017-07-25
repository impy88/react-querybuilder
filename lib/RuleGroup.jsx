import React from 'react';
import Rule from './Rule';

export default class RuleGroup extends React.Component {
    static get defaultProps() {
        return {
            id: null,
            parentId: null,
            rules: [],
            combinator: 'and',
            schema: {},
        };
    }

    render() {
        const { combinator, rules, schema: {combinators, controls, onRuleRemove, isRuleGroup, getLevel, classNames } } = this.props;
        const level = getLevel(this.props.id);
          return (
            <div className={`ruleGroup ${classNames.ruleGroup}`} style={{ marginLeft: level > 0 ? '15px' : 0}}>
                 {
                     rules.map((r, idx)=> {
                         return (
                             isRuleGroup(r)
                                 ? <RuleGroup key={r.id}
                                              id={r.id}
                                              idx={idx}
                                              schema={this.props.schema}
                                              parentId={this.props.id}
                                              combinator={r.combinator}
                                              rules={r.rules}/>
                                 : <Rule key={r.id}
                                         id={r.id}
                                         idx={idx}
                                         field={r.field}
                                         value={r.value}
                                         rules={rules}
                                         operator={r.operator}
                                         combinator={this.props.combinator}
                                         schema={this.props.schema}
                                         parentId={this.props.id}
                                         parentGroupId={this.props.parentId}
                                         onRuleRemove={onRuleRemove}/>
                         );
                     })
                 }
            </div>
        );
    }

    hasParentGroup() {
        return this.props.parentId;
    }

    onCombinatorChange = (value) => {
        const {onPropChange} = this.props.schema;

        onPropChange('combinator', value, this.props.id);
    }

    addRule = (event) => {
        event.preventDefault();
        event.stopPropagation();

        const {createRule, onRuleAdd} = this.props.schema;

        const newRule = createRule();
        onRuleAdd(newRule, this.props.id)
    }

    addGroup = (event) => {
        event.preventDefault();
        event.stopPropagation();

        const {createRuleGroup, onGroupAdd} = this.props.schema;
        const newGroup = createRuleGroup();
        onGroupAdd(newGroup, this.props.id)
    }

    removeGroup = (event) => {
        event.preventDefault();
        event.stopPropagation();

        this.props.schema.onGroupRemove(this.props.id, this.props.parentId);
    }


}
