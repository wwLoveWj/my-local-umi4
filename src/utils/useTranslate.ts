import { useCallback } from "react";
import { useIntl } from "umi";

const useTranslation = () => {
  const _intl = useIntl();

  const intl = useCallback(
    (id: string, value?: Record<string, any>) => {
      try {
        return _intl.messages[id] ? _intl.formatMessage({ id }, value) : id;
      } catch (e) {
        return id;
      }
    },
    [_intl]
  );
  return intl;
};

export default useTranslation;
