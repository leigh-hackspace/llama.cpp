import { useEffect, useState } from 'react';
import StorageUtils from '../utils/storage';
import { useAppContext } from '../utils/app.context';
import { classNames } from '../utils/misc';
import daisyuiThemes from 'daisyui/src/theming/themes';
import { THEMES } from '../Config';
import { useNavigate } from 'react-router';

export default function Header() {
  const navigate = useNavigate();
  const [selectedTheme, setSelectedTheme] = useState(StorageUtils.getTheme());
  const { setShowSettings } = useAppContext();

  const setTheme = (theme: string) => {
    StorageUtils.setTheme(theme);
    setSelectedTheme(theme);
  };

  useEffect(() => {
    document.body.setAttribute('data-theme', selectedTheme);
    document.body.setAttribute(
      'data-color-scheme',
      // @ts-expect-error daisyuiThemes complains about index type, but it should work
      daisyuiThemes[selectedTheme]?.['color-scheme'] ?? 'auto'
    );
  }, [selectedTheme]);

  const { isGenerating, viewingChat } = useAppContext();
  const isCurrConvGenerating = isGenerating(viewingChat?.conv.id ?? '');

  const removeConversation = () => {
    if (isCurrConvGenerating || !viewingChat) return;
    const convId = viewingChat?.conv.id;
    if (window.confirm('Are you sure to delete this conversation?')) {
      StorageUtils.remove(convId);
      navigate('/');
    }
  };

  const downloadConversation = () => {
    if (isCurrConvGenerating || !viewingChat) return;
    const convId = viewingChat?.conv.id;
    const conversationJson = JSON.stringify(viewingChat, null, 2);
    const blob = new Blob([conversationJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversation_${convId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-row items-center pt-6 pb-6 sticky top-0 z-10 bg-base-100">
      {/* open sidebar button */}
      <label htmlFor="toggle-drawer" className="btn btn-ghost lg:hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-list"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
          />
        </svg>
      </label>

      <div className="grow text-2xl font-bold ml-2" style={{ display: "flex", alignItems: "center" }}><img src="data:image/vndmicrosofticon;base64,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///7+v7/qpPr/08d1f9FEdP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/xGEtNkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEYS0wpGEtO3RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RA/S/3FJ3f/i2vj/////////////////////////////////////////////////8u78/3VO3v9CDNL/RRHT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtO7RhLTDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEYS0zFGEtPrRhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9ED9L/cUnd/+La+P/////////////////////////////////////////////////49v3/nIDn/1or2P+FY+L/Tx3V/0UR0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtPvRhLTOQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEYS02lGEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9FEdP/RA/S/0QP0v9xSd3/4tr4//////////////////////////////////////////////////f1/f+afef/VSbX/7qn7//6+f7/rJTr/00b1f9FEdP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLTdQAAAAAAAAAAAAAAAAAAAAAAAAAARhLTAUYS055GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0UR0/9PHdX/dU7e/3hS3//i2fj//////////////////////////////////Pz+/8Kw8P/i2vj/9/X9/5d55v9VJdf/uabu//79////////+/r+/6yU6/9NG9X/RRHT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLTq0YS0wQAAAAAAAAAAAAAAAAAAAAARhLTDEYS08RGEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RRHT/00a1f+rk+v/9PD8//Ht/P///////////////////////////////////////fz+/56D6P9yS97/h2bj/1Ym1/+5pu7//v3///////////////////v6/v+slOv/TRvV/0UR0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT0EYS0xMAAAAAAAAAAAAAAAAAAAAARhLTGEYS09dGEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9FEdP/TRrV/6qT6//7+v7///////////////////////////////////////////////////////f0/f+Xeeb/RxPT/6eO6v/////////////////////////////////7+v7/rJTr/00b1f9FEdP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT5kYS0yYAAAAAAAAAAAAAAAAAAAAARhLTHkYS099GEtP/RhLT/0YS0/9GEtP/RhLT/0UR0/9NG9X/qpPr//v6/v/////////////////////////////////////////////////////////////////39P3/lnnm/3ZQ3v/m3/n/////////////////////////////////+/v+/6yV6/9OHNX/RRHT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT8EYS0zQAAAAAAAAAAAAAAAAAAAAARhLTIEYS0+FGEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/+hhun//Pz+///////////////////////////////////////49v3/39b3//z7/v//////////////////////9fL9/6qS6//e1ff///////////////////////////////////////38/v+hhun/RhPT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT80YS0zsAAAAAAAAAAAAAAAAAAAAARhLTG0YS091GEtP/RhLT/0YS0/9GEtP/RhLT/0UR0/9/W+H/7Ob6///////////////////////////////////////VyfX/Yjba/7ej7v/+/f////////////////////////7+/////////////////////////////////////////////+vl+v9+WuD/RRHT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT9UYS0zsAAAAAAAAAAAAAAAAAAAAARhLTE0YS09BGEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9FENP/flrg/+vm+v/////////////////////////////////59/7/mn3n/1Ii1v+4pO7//v3/////////////////////////////////////////////////////////////6uT6/31Y4P9EENP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT8EYS0zQAAAAAAAAAAAAAAAAAAAAARhLTBkYS07FGEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RRDT/35a4P/r5vr////////////////////////////49f3/lHbm/0sY1P9VJdb/tqLu//39///////////////////////////////////////////////////q5Pr/fVjg/0QQ0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT1kYS0xsAAAAAAAAAAAAAAAAAAAAAAAAAAEYS019GEtP3RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0UQ0/9+WuD/6+b6//////////////////j2/f+afuf/VSbX/7Wg7f+cgOf/eFLf//Ht/P/////////////////////////////////9/f//zL7z/8/C9P9+WuD/RBDT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP5RhLTcgAAAAAAAAAAAAAAAAAAAAAAAAAARhLTAUYS0wlGEtNuRhLT0UYS091GEtPARhLT3kYS0/9GEtP/RhLT/0YS0/9FENP/flrg/+vm+v//////+Pb9/5yA6P9WJtf/uabu//7+///49f3/6+X6///+//////////////////////////////7+//+8qe//VSXX/1Eg1v9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS09BGEtPARhLT3UYS08ZGEtNoRhLTC0YS0wQAAAAAAAAAAAAAAABGEtMHRhLTb0YS03tGEtMeRhLTGEYS0xlGEtMmRhLTskYS0/9GEtP/RhLT/0YS0/9GEtP/RRDT/39b4f/l3fn/noPo/1Ym1/+5pu7//v3//////////////////////////////////////////////v7//7yq7/9UI9b/RBDT/0UR0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS05xGEtMpRhLTGkYS0xJGEtMpRhLTg0YS05VGEtMYAAAAAEYS0w1GEtODRhLT90YS0/9GEtO0RhLTFkYS00pGEtPQRhLT/UYS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9gM9n/WivY/7qn7//+/f/////////////////////////////////////////////+/v//vKrv/1Qj1v9EENP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/xGEtPZRhLTaUYS0w5GEtOhRhLT/0YS0/9GEtOsRhLTIEYS04BGEtPoRhLT+kYS0/lGEtNbRhLTLkYS0+FGEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9CDtL/akDc/+ni+v////////////////////////////////////////////79//+8qe//VCPW/0QQ0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT8EYS00JGEtNCRhLT60YS0+1GEtPeRhLTi0YS0yBGEtMxRhLTSUYS01dGEtMPRhLTd0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/39b4P/r5fr//////////////////////////////////////97V9/9cLtj/RA/T/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS04NGEtMHRhLTOEYS0y5GEtMdRhLTEAAAAAAAAAAAAAAAAAAAAAAAAAAARhLTiUYS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0UQ0/9+WuD/6+b6/////////////////////////////////+HY+P9gM9n/RBDT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS03sAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARhLTVkYS0/lGEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9FENP/flrg/+vl+v//////////////////////6+X6/35a4P9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT6kYS0zcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARhLTEEYS07lGEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RRDT/35Z4P/q5fr////////////q5fr/flng/0QQ0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLTk0YS0wQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEYS0zlGEtPjRhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0QQ0/99WOD/6+X6/+vl+v99WOD/RBDT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtPRRhLTJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABGEtNiRhLT80YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9FENP/d1Df/3dQ3/9FENP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0+5GEtNQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABGEtMFRhLTeEYS0/dGEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RBDT/0QQ0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT9UYS025GEtMCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARhLTB0YS03hGEtPyRhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtPzRhLTdEYS0wUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEYS0wRGEtNgRhLT40YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLTxkYS07tGEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0+ZGEtNlRhLTBQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABGEtMBRhLTOUYS07dGEtP5RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLTckYS01dGEtP9RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP8RhLTv0YS0z5GEtMBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEYS0w9GEtNiRhLTykYS0/tGEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP4RhLTTEYS0zFGEtPtRhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/kYS09pGEtN0RhLTFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARhLTFkYS02BGEtOvRhLT40YS0/pGEtP/RhLT/0YS0/tGEtOeRhLTFEYS0w9GEtODRhLT+EYS0/9GEtP/RhLT/0YS0/VGEtPKRhLTd0YS0yJGEtMBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABGEtMGRhLTJkYS009GEtN1RhLTh0YS01tGEtMSRhLTb0YS031GEtMNRhLTV0YS05xGEtOkRhLTfkYS00JGEtMSAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABGEtNdRhLT8kYS0/VGEtNuAAAAAEYS0wFGEtMBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABGEtNTRhLT+EYS0/9GEtNwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABGEtMQRhLTxEYS09ZGEtMbAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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0/9GEtP/RxPT/7qm7///////////////////////6+b6/39b4f9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS06JGEtMGAAAAAAAAAAAAAAAAAAAAAEYS0zNGEtPqRhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0UQ0/+AXeH/7Ob6////////////////////////////49v4/2Az2f9DDtL/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT60YS0zUAAAAAAAAAAAAAAAAAAAAARhLTdkYS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0QQ0/9EENP/gF3h/+zn+/////////////////////////////j2/f+ghej/iWjj/31Y4P9FEdP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLTfAAAAAAAAAAAAAAAAEYS0wVGEtOvRhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/YTXZ/4dl4v/s5/r/////////////////+/r+/9rP9v/w7Pz/nYHo/4xs5P/x7fz/7ej7/4Bc4f9FENP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtO3RhLTBwAAAAAAAAAARhLTE0YS09FGEtP/RhLT/0YS0/9GEtP/RRDT/39c4f/l3vn/9vP9///////////////////////8+/7/q5Pr/3VO3v+NbeT/8Oz7////////////7Of6/4Bc4f9FENP/RhLT/0YS0/9GEtP/RhLT/0YS09lGEtMZAAAAAAAAAABGEtMdRhLT3kYS0/9GEtP/RhLT/0YT0/+AXOH/6+b6///////////////////////////////////////39f3/mn3n/6iP6v/+/v//////////////////7Of6/4Fd4f9HE9P/RhLT/0YS0/9GEtP/RhLT6UYS0yoAAAAAAAAAAEYS0x9GEtPgRhLT/0YS0/9FENP/WizY/9zS9////////////////////////Pv+/8m68v/t6Pv////////////18v3/0ML0//v6/v//////////////////////3NL3/1os2P9FENP/RhLT/0YS0/9GEtPuRhLTMAAAAAAAAAAARhLTGEYS09hGEtP/RhLT/0YS0/9IFNP/i2rj//Ht/P/////////////////+/f//oojp/4dl4v/v6/v///////////////////////////////////////Hs/P+KaeP/SBTT/0YS0/9GEtP/RhLT/0YS0+xGEtMtAAAAAAAAAABGEtMIRhLTtUYS0/9GEtP/RhLT/0YS0/9GEtP/imnj//Ht/P////////////j2/f+bfuf/Zjvb/5N15f/39f3///////////////////////n4/v/t6Pv/iWjj/0YR0/9GEtP/RhLT/0YS0/9GEtP/RhLTykYS0xQAAAAAAAAAAEYS0wFGEtNCRhLTxkYS09dGEtPcRhLT/0YS0/9GEtP/imnj//Lu/P/59/7/n4Po/41t5P/n4fn/z8L0//j2/f/////////////////x7fz/knPl/2pA3P9HFNP/RhLT/0YS0/5GEtPWRhLT1kYS08FGEtNHRhLTBAAAAABGEtMLRhLTdkYS04tGEtMuRhLTOUYS069GEtP/RhLT/0YS0/9GEtP/iWjj/5t/5/+ObuT/8Ov7////////////////////////////8e38/4tq4/9FEdP/RA/S/0YS0/9GEtP/RhLT/kYS06dGEtNBRhLTKUYS05JGEtOQRhLTFkYS03tGEtPsRhLT1kYS00NGEtPCRhLT/0YS0/9GEtP/RhLT/0YS0/9EENP/XjHZ/+DY+P////////////////////////////Ds/P+KauP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS09JGEtNCRhLTxEYS0+dGEtOHRhLTI0YS0zdGEtMtRhLTW0YS0/1GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9IFNP/i2rj//Ht/P//////////////////////vKnv/0gU0/9GEdP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/kYS01xGEtMeRhLTJ0YS0xkAAAAAAAAAAAAAAABGEtNKRhLT90YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/imnj//Ht/P////////////Ht/P+HZeL/RhHT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS0/9GEtPtRhLTOQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEYS0w5GEtOwRhLT/0YS0/9GEtP/RhLT/0YS0/9GEtP/RhLT/0YS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" alt="Leigh Hackspace Logo" />&nbsp;HackGPT</div>

      {/* action buttons (top right) */}
      <div className="flex items-center">
        {viewingChat && (
          <div className="dropdown dropdown-end">
            {/* "..." button */}
            <button
              tabIndex={0}
              role="button"
              className="btn m-1"
              disabled={isCurrConvGenerating}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-three-dots-vertical"
                viewBox="0 0 16 16"
              >
                <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
              </svg>
            </button>
            {/* dropdown menu */}
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
            >
              <li onClick={downloadConversation}>
                <a>Download</a>
              </li>
              <li className="text-error" onClick={removeConversation}>
                <a>Delete</a>
              </li>
            </ul>
          </div>
        )}

        <div className="tooltip tooltip-bottom" data-tip="Settings">
          <button className="btn" onClick={() => setShowSettings(true)}>
            {/* settings button */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-gear"
              viewBox="0 0 16 16"
            >
              <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0" />
              <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z" />
            </svg>
          </button>
        </div>

        {/* theme controller is copied from https://daisyui.com/components/theme-controller/ */}
        <div className="tooltip tooltip-bottom" data-tip="Themes">
          <div className="dropdown dropdown-end dropdown-bottom">
            <div tabIndex={0} role="button" className="btn m-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-palette2"
                viewBox="0 0 16 16"
              >
                <path d="M0 .5A.5.5 0 0 1 .5 0h5a.5.5 0 0 1 .5.5v5.277l4.147-4.131a.5.5 0 0 1 .707 0l3.535 3.536a.5.5 0 0 1 0 .708L10.261 10H15.5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-.5.5H3a3 3 0 0 1-2.121-.879A3 3 0 0 1 0 13.044m6-.21 7.328-7.3-2.829-2.828L6 7.188zM4.5 13a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0M15 15v-4H9.258l-4.015 4zM0 .5v12.495zm0 12.495V13z" />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content bg-base-300 rounded-box z-[1] w-52 p-2 shadow-2xl h-80 overflow-y-auto"
            >
              <li>
                <button
                  className={classNames({
                    'btn btn-sm btn-block btn-ghost justify-start': true,
                    'btn-active': selectedTheme === 'auto',
                  })}
                  onClick={() => setTheme('auto')}
                >
                  auto
                </button>
              </li>
              {THEMES.map((theme) => (
                <li key={theme}>
                  <input
                    type="radio"
                    name="theme-dropdown"
                    className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                    aria-label={theme}
                    value={theme}
                    checked={selectedTheme === theme}
                    onChange={(e) => e.target.checked && setTheme(theme)}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
