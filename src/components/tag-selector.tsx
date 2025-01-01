"use client";

import { useState } from "react";
import Select from "react-select";

import type { Tag as RawTag } from "~/shared/types";
import type { ActionMeta, ClassNamesConfig, GroupBase, ThemeConfig } from "react-select";

interface ReactSelectTag {
    label: string;
    value: string;
    isFixed: boolean;
}

interface Properties {
    value: RawTag[];
}

const toReactSelectOptions = (tags: string[]): readonly ReactSelectTag[] =>
    tags.map(value => ({ isFixed: false, label: value, value }));

export default function TagSelector(properties: Properties) {
    const [internalTags, setInternalTags] = useState<string[]>([]);
    const clearIndicatorClass = "text-base-content/50 hover:cursor-pointer";
    const controlClass = "w-full !min-h-min !h-fit flex flex-row justify-center items-center";
    const containerClass = "input input-bordered flex justify-center items-center py-3 px-5 h-fit";
    const dropdownIndicatorClass = "text-base-content/50";
    const indicatorSeparatorClass = "hidden";
    const indicatorsContainerClass = "h-fit !self-auto";
    const menuListClass = "bg-base-100 rounded";
    const multiValueClass = "badge badge-info gap-0.5 pr-[0.375rem]";
    const optionClass = "hover:bg-primary box-border px-4 py-2";
    const placeholderClass = "!text-base-content/60";
    const valueContainerClass = "flex flex-row gap-1 max-w-full flex-wrap";
    const classNames: ClassNamesConfig<ReactSelectTag, true, GroupBase<ReactSelectTag>> = {
        clearIndicator: () => clearIndicatorClass,
        container: () => containerClass,
        control: () => controlClass,
        dropdownIndicator: () => dropdownIndicatorClass,
        indicatorsContainer: () => indicatorsContainerClass,
        indicatorSeparator: () => indicatorSeparatorClass,
        menuList: () => menuListClass,
        multiValue: () => multiValueClass,
        option: () => optionClass,
        placeholder: () => placeholderClass,
        valueContainer: () => valueContainerClass,
    };
    const getTheme: ThemeConfig = theme => ({
        ...theme,
        colors: {
            ...theme.colors,
            primary25: "oklch(var(--p))",
            danger: "",
            dangerLight: "oklch(var(--er))",
        },
    });

    // eslint-disable-next-line
    const setTags = (newValue: readonly ReactSelectTag[], _meta: ActionMeta<ReactSelectTag>) =>
        setInternalTags(newValue.map(({ value: tag }) => tag));

    // TODO: Make all tags always show up
    // TODO: Gray out and disable selected tags from menu
    return properties.value.length >= 1 ? (
        <Select
            classNames={classNames}
            name="tag-selector"
            onChange={setTags}
            options={toReactSelectOptions(properties.value)}
            placeholder="Tags"
            theme={getTheme}
            value={toReactSelectOptions(internalTags)}
            isMulti
            unstyled
        />
    ) : null;
}
