# ServeImages

Не все удалось реализовать.

Все должно запускаться без дополнительных действий.
Фрон сделан на Web Components. 
Запрос с неверными (запрещенными) путями не пропускаеться при помощи авторизации.
Навигация по папкам происходит за счет немного дополненого DirectoryBrowserMiddleware.
Навигация по папкам и файлам происходит на одном дашборде без каких либо явных различий между ними.
Перед тем как показать собержимое папки происходит фильтрация запрещенных директорий и расширений.
Если все ок то запрос дальше пробрасываеться на следующий middleware который "раздает" картинки.

Нет спинера, управление картинкой (просто отображение).
Может показаться странным использование следующей конструкции:

import './SiPicture';
import SiDashboard from './SirDashboard';

это потому что встроенная разбивка на модули в транспайлере не понимает что это (import SiDashboard from './SirDashboard';) модуль и пэтому приходиться явно указывать что есть зависимость на файл (import './SiPicture';)
