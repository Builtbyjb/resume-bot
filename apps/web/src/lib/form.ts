import { createFormHook } from "@tanstack/react-form";
import { Checkbox, ChipGroup, RadioCards, Switch, YesNo } from "@/components/form/choices";
import {
    DateInput,
    FieldError,
    LinesTextArea,
    MonthField,
    MonthInput,
    NumberInput,
    Select,
    SelectField,
    TextArea,
    TextAreaField,
    TextField,
    TextInput,
} from "@/components/form/inputs";
import { SaveBar } from "@/components/form/save-bar";
import { TagInput } from "@/components/form/tag-input";
import { fieldContext, formContext } from "./form-context";

export const { useAppForm, withForm } = createFormHook({
    fieldContext,
    formContext,
    fieldComponents: {
        Checkbox,
        ChipGroup,
        DateInput,
        FieldError,
        LinesTextArea,
        MonthField,
        MonthInput,
        NumberInput,
        RadioCards,
        Select,
        SelectField,
        Switch,
        TagInput,
        TextArea,
        TextAreaField,
        TextField,
        TextInput,
        YesNo,
    },
    formComponents: {
        SaveBar,
    },
});
